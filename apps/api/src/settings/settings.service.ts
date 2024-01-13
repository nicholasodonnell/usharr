import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type {
  GeneralSettings,
  RadarrSettings,
  TautulliSettings,
} from '@usharr/types'

import { PrismaService } from '../prisma.service'

const generalSettingsSelect: Prisma.SettingsSelect = {
  enabled: true,
  syncDays: true,
  syncHour: true,
}
const radarrSettingsSelect: Prisma.SettingsSelect = {
  radarrApiKey: true,
  radarrUrl: true,
}
const tautulliSettingsSelect: Prisma.SettingsSelect = {
  tautlliLibraryIds: true,
  tautulliApiKey: true,
  tautulliUrl: true,
}

@Injectable()
export class SettingsService implements OnModuleInit {
  private readonly id = 1
  private readonly logger = new Logger(SettingsService.name)

  constructor(private prisma: PrismaService) {}

  // module methods //

  private async findFirst<T>(select: Prisma.SettingsSelect): Promise<T> {
    return this.prisma.settings.findFirst({
      select,
      where: { id: this.id },
    }) as T
  }

  // priv methods //

  private serializeTautulliRecord(record): TautulliSettings {
    const { tautlliLibraryIds, tautulliApiKey, tautulliUrl } = record

    return {
      tautlliLibraryIds: tautlliLibraryIds?.split(',').map(Number) ?? [],
      tautulliApiKey,
      tautulliUrl,
    }
  }

  // public methods //

  private async update<T>(params: {
    select: Prisma.SettingsSelect
    update: Prisma.SettingsUpdateInput
  }): Promise<T> {
    const { select, update } = params

    return this.prisma.settings.update({
      data: update,
      select,
      where: { id: this.id },
    }) as T
  }

  /**
   * Get general settings
   */
  async getGeneral(): Promise<GeneralSettings> {
    try {
      return this.findFirst<GeneralSettings>(generalSettingsSelect)
    } catch (e) {
      const error = new Error(`Failed to get general settings: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Update Radarr settings
   */
  async getRadarr(): Promise<RadarrSettings> {
    try {
      return this.findFirst<RadarrSettings>(radarrSettingsSelect)
    } catch (e) {
      const error = new Error(`Failed to get radarr settings: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Get Tautulli settings
   */
  async getTautulli(): Promise<TautulliSettings> {
    try {
      const record = await this.findFirst<TautulliSettings>(
        tautulliSettingsSelect,
      )

      return this.serializeTautulliRecord(record)
    } catch (e) {
      const error = new Error(`Failed to get tautulli settings: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  async onModuleInit() {
    await this.prisma.settings.upsert({
      create: { id: this.id },
      update: {},
      where: { id: this.id },
    })
  }

  /**
   * Update general settings
   */
  async updateGeneral(settings: GeneralSettings): Promise<GeneralSettings> {
    try {
      const { enabled, syncDays, syncHour } = settings
      const data = { enabled, syncDays, syncHour }

      return this.update<GeneralSettings>({
        select: generalSettingsSelect,
        update: data,
      })
    } catch (e) {
      const error = new Error(`Failed to update general settings: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  // database methods //

  /**
   * Update Radarr settings
   */
  async updateRadarr(settings: RadarrSettings): Promise<RadarrSettings> {
    try {
      const { radarrApiKey, radarrUrl } = settings
      const data = { radarrApiKey, radarrUrl }

      return this.update<RadarrSettings>({
        select: radarrSettingsSelect,
        update: data,
      })
    } catch (e) {
      const error = new Error(`Failed to update radarr settings: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Update Tautulli settings
   */
  async updateTautulli(settings: TautulliSettings): Promise<TautulliSettings> {
    try {
      const { tautlliLibraryIds, tautulliApiKey, tautulliUrl } = settings
      const data = {
        tautlliLibraryIds: tautlliLibraryIds?.join(',') ?? undefined,
        tautulliApiKey,
        tautulliUrl,
      }

      return this.update<TautulliSettings>({
        select: tautulliSettingsSelect,
        update: data,
      })
    } catch (e) {
      const error = new Error(
        `Failed to update tautulli settings: ${e.message}`,
      )
      this.logger.error(error.message)

      throw error
    }
  }
}
