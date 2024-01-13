import { Injectable, Logger } from '@nestjs/common'
import type {
  TautulliGetLibraryMediaInfoResponse,
  TautulliGetLibraryNamesResponse,
  TautulliLibrary,
  TautulliMediaInfo,
  TautulliPing,
  TautulliSettings,
  TautulliWatchHistory,
} from '@usharr/types'
import type { AxiosInstance } from 'axios'
import axios from 'axios'

import { SettingsService } from '../settings/settings.service'

@Injectable()
export class TautulliService {
  private readonly logger = new Logger(TautulliService.name)

  constructor(private settings: SettingsService) {}

  // priv methods //

  private async createClient(
    tautulliSettings?: TautulliSettings,
  ): Promise<AxiosInstance> {
    const { tautulliApiKey, tautulliUrl } =
      tautulliSettings ?? (await this.settings.getTautulli())

    return axios.create({
      baseURL: tautulliUrl,
      params: { apikey: tautulliApiKey },
      timeout: 10000,
    })
  }

  // public methods //

  /**
   * Get all libraries from Tautulli
   */
  async getLibraries(
    tautulliSettings?: TautulliSettings,
  ): Promise<TautulliLibrary[]> {
    try {
      const client = await this.createClient(tautulliSettings)

      const response = await client.get<TautulliGetLibraryNamesResponse>(
        '/api/v2',
        {
          params: {
            cmd: 'get_library_names',
          },
        },
      )

      return (
        response.data?.response?.data
          ?.filter((library) => library.section_type === 'movie')
          ?.map((library) => ({
            section_id: library.section_id,
            section_name: library.section_name,
          })) ?? []
      )
    } catch (e) {
      const error = new Error(`Failed to retrieve library names: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Search Tautulli for media info for all movie titles
   * Loops through all titles and libraries for matches
   */
  async getWatchHistoryFromAllLibrariesForTitles(
    titles: string[],
    tautulliSettings?: TautulliSettings,
  ): Promise<TautulliWatchHistory[]> {
    try {
      const matches: TautulliWatchHistory[] = []

      const { tautlliLibraryIds } =
        tautulliSettings ?? (await this.settings.getTautulli())

      for await (const libraryId of tautlliLibraryIds) {
        for await (const title of titles) {
          const mediaInfo = await this.searchMediaInfoForTitle(
            title,
            libraryId,
            tautulliSettings,
          )

          if (mediaInfo) {
            matches.push(mediaInfo)

            // break out of the loop if we found a match for this title
            break
          }
        }
      }

      return matches
    } catch (e) {
      const error = new Error(
        `Failed to get media info for titles: ${e.message}`,
      )
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Ping Tautulli to see if it's up and running
   */
  async ping(tautulliSettings?: TautulliSettings): Promise<TautulliPing> {
    try {
      const client = await this.createClient(tautulliSettings)

      const response = await client.get('/api/v2', {
        params: {
          cmd: 'get_tautulli_info',
        },
      })

      return {
        libraries: await this.getLibraries(tautulliSettings),
        success: response.status === 200,
      }
    } catch (e) {
      const error = new Error(`Failed to ping tautulli: ${e.message}`)
      this.logger.error(error.message)

      return { success: false }
    }
  }

  /**
   * Search Tautulli for media info for a given movie title (search string) and library (section_id)
   */
  async searchMediaInfoForTitle(
    title: string,
    libraryId: number,
    tautulliSettings?: TautulliSettings,
  ): Promise<TautulliWatchHistory | undefined> {
    try {
      const client = await this.createClient(tautulliSettings)
      const response = await client.get<TautulliGetLibraryMediaInfoResponse>(
        '/api/v2',
        {
          params: {
            cmd: 'get_library_media_info',
            refresh: true,
            search: title,
            section_id: libraryId,
            section_type: 'movie',
          },
        },
      )

      const items: TautulliMediaInfo[] =
        response.data?.response?.data?.data ?? []

      const match: TautulliMediaInfo = items.find(
        (item) => item.title === title,
      )

      return match
        ? {
            lastWatchedAt: new Date(match.last_played * 1000),
            watched: match.play_count > 0,
          }
        : undefined
    } catch (e) {
      const error = new Error(
        `Failed to get media info for "${title}": ${e.message}`,
      )
      this.logger.error(error.message)

      throw error
    }
  }
}
