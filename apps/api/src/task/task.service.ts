import { Injectable, Logger } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import type { GeneralSettings, Sync } from '@usharr/types'

import { SettingsService } from '../settings/settings.service'
import { SyncService } from '../sync/sync.service'

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000
const ONE_DAY_MS = TWELVE_HOURS_MS * 2

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name)

  constructor(
    private settings: SettingsService,
    private sync: SyncService,
  ) {}

  /**
   * Performs either a FULL or PARTIAL sync depending on user settings
   */
  @Cron('0 * * * *')
  async runSync(): Promise<void> {
    try {
      const { enabled, syncDays, syncHour }: GeneralSettings =
        await this.settings.getGeneral()
      const runningSyncs: Sync[] = await this.sync.getRunning()
      const lastFullSync: Sync | null = await this.sync.getLastFull()
      const now: Date = new Date()

      if (runningSyncs.length > 0) {
        this.logger.warn('Sync already running, skipping')

        return
      }

      // a full sync should be done when:
      // - sync setting is enabled
      // - sync hour matches current hour
      // - no last full sync exists
      // - last full sync finished more than sync days ago
      const shouldDoFullSync: boolean =
        (enabled && syncHour === now.getHours() && !lastFullSync) ||
        (lastFullSync?.finishedAt &&
          now.getTime() - lastFullSync.finishedAt.getTime() >=
            syncDays * ONE_DAY_MS)

      if (shouldDoFullSync) {
        return await this.sync.full()
      }

      return await this.sync.partial()
    } catch (e) {
      const error = new Error(`Failed to execute run sync task: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Stops any long running syncs that have been running for more than 12 hours
   */
  @Cron('0 */12 * * *')
  async stopLongRunningSyncs(): Promise<void> {
    try {
      const runningSyncs: Sync[] = await this.sync.getRunning()

      for await (const runningSync of runningSyncs) {
        if (Date.now() - runningSync.startedAt.getTime() > TWELVE_HOURS_MS) {
          await this.sync.finish(runningSync.id)

          this.logger.warn(`Stopped long running sync "${runningSync.id}"`)
        }
      }
    } catch (e) {
      const error = new Error(
        `Failed to execute stop long running syncs task: ${e.message}`,
      )
      this.logger.error(error.message)

      throw e
    }
  }
}
