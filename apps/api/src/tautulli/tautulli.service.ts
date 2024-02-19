import { Injectable, Logger } from '@nestjs/common'
import type {
  TautulliGetHistoryResponse,
  TautulliHistory,
  TautulliSettings,
} from '@usharr/types'
import type { AxiosInstance } from 'axios'
import axios from 'axios'

import { SettingsService } from '../settings/settings.service'

import { TautulliPing } from './tautulli.model'

@Injectable()
export class TautulliService {
  private readonly logger = new Logger(TautulliService.name)

  constructor(private settings: SettingsService) {}

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

  async getHistory(
    after: Date,
    tautulliSettings?: TautulliSettings,
  ): Promise<TautulliHistory[]> {
    try {
      const client = await this.createClient(tautulliSettings)
      const response = await client.get<TautulliGetHistoryResponse>('/api/v2', {
        params: {
          after: after.toISOString().split('T')[0],
          cmd: 'get_history',
          length: 999999, // get all history
          media_type: 'movie',
        },
      })

      const historyItems: Record<string, Date> = {}

      for (const history of response?.data?.response?.data?.data ?? []) {
        const { date, title, watched_status } = history

        // movie must be watched at least 50% to be considered watched
        if (watched_status < 0.5) {
          continue
        }

        // Only add the first watched item for each title because we only want to consider
        // the latest watched date
        if (historyItems[title]) {
          continue
        }

        // Convert the date from seconds to milliseconds
        historyItems[title] = new Date(date * 1000)
      }

      return Object.entries(historyItems).map(([title, date]) => ({
        date,
        title,
      }))
    } catch (e) {
      const error = new Error(`Failed to retrieve history: ${e.message}`)
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

      return new TautulliPing({
        success: response.status === 200,
      })
    } catch (e) {
      const error = new Error(`Failed to ping tautulli: ${e.message}`)
      this.logger.error(error.message)

      return { success: false }
    }
  }
}
