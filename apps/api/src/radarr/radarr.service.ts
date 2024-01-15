import { Injectable, Logger } from '@nestjs/common'
import type {
  ImportlistMovie,
  RadarrMediaManagement,
  RadarrMovie,
  RadarrPing,
  RadarrSettings,
  RadarrTag,
} from '@usharr/types'
import type { AxiosInstance } from 'axios'
import axios from 'axios'

import { SettingsService } from '../settings/settings.service'

@Injectable()
export class RadarrService {
  private readonly logger = new Logger(RadarrService.name)

  constructor(private settings: SettingsService) {}

  private async createClient(
    radarrSettings?: RadarrSettings,
  ): Promise<AxiosInstance> {
    const { radarrApiKey, radarrUrl } =
      radarrSettings ?? (await this.settings.getRadarr())

    return axios.create({
      baseURL: radarrUrl,
      headers: { 'X-Api-Key': radarrApiKey },
      timeout: 10000,
    })
  }

  /**
   * Delete a movie from Radarr. This action will:
   * - Delete the movie from Radarr
   * - Delete the movie file from disk
   * - Exclude the movie from list imports
   */
  async deleteMovie(
    movieId: number,
    radarrSettings?: RadarrSettings,
  ): Promise<void> {
    try {
      const client = await this.createClient(radarrSettings)

      await client.delete(`/api/v3/movie/${movieId}`, {
        params: {
          addImportExclusion: true,
          deleteFiles: true,
        },
      })
    } catch (e) {
      const error = new Error(`Failed to delete movie file: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Get all import list movies (movies that appear on a list)
   */
  public async getImportlistMovies(
    radarrSettings?: RadarrSettings,
  ): Promise<ImportlistMovie[]> {
    try {
      const client = await this.createClient(radarrSettings)
      const response = await client.get<ImportlistMovie[]>(
        '/api/v3/importlist/movie',
      )

      return response.data
    } catch (e: any) {
      const error = new Error(
        `Failed to retrieve import list movies: ${e.message}`,
      )
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Get media management config from Radarr (used to determine if the recycle bin is enabled)
   */
  async getMediaManagementConfig(
    radarrSettings?: RadarrSettings,
  ): Promise<RadarrMediaManagement> {
    try {
      const client = await this.createClient(radarrSettings)
      const response = await client.get<RadarrMediaManagement>(
        '/api/v3/config/mediamanagement',
      )

      return response.data
    } catch (e) {
      const error = new Error(
        `Failed to retrieve media management config: ${e.message}`,
      )
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Get all movies from Radarr
   */
  async getMovies(radarrSettings?: RadarrSettings): Promise<RadarrMovie[]> {
    try {
      const client = await this.createClient(radarrSettings)
      const response = await client.get<RadarrMovie[]>('/api/v3/movie')

      return response.data ?? []
    } catch (e) {
      const error = new Error(`Failed to retrieve movies: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Get all tags from Radarr
   */
  async getTags(radarrSettings?: RadarrSettings): Promise<RadarrTag[]> {
    try {
      const client = await this.createClient(radarrSettings)
      const response = await client.get<RadarrTag[]>('/api/v3/tag')

      return response.data ?? []
    } catch (e) {
      const error = new Error(`Failed to retrieve tags: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Ping Radarr to see if it's up and running
   */
  async ping(radarrSettings?: RadarrSettings): Promise<RadarrPing> {
    try {
      const client = await this.createClient(radarrSettings)
      const response = await client.get('/api/v3/system/status')

      return {
        hasRecycleBin: Boolean(
          (await this.getMediaManagementConfig(radarrSettings)).recycleBin,
        ),
        success: response.status === 200,
      }
    } catch (e) {
      const error = new Error(`Failed to ping radarr: ${e.message}`)
      this.logger.error(error.message)

      return { success: false }
    }
  }
}
