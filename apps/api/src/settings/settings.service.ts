import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import type {
  GeneralSettings,
  RadarrSettings,
  TautulliSettings,
} from '@usharr/types'

import { PrismaService } from '../prisma/prisma.service'

const generalSettingsSelect: Prisma.SettingsSelect = {
  enabled: true,
  syncDays: true,
  syncHour: true,
}
const radarrSettingsSelect: Prisma.SettingsSelect = {
  radarrUrl: true,
  radarrApiKey: true,
}
const tautulliSettingsSelect: Prisma.SettingsSelect = {
  tautulliUrl: true,
  tautulliApiKey: true,
  tautlliLibraryIds: true,
}

@Injectable()
export class SettingsService implements OnModuleInit {
  private readonly logger = new Logger(SettingsService.name)
  private readonly id = 1

  constructor(private prisma: PrismaService) {}

  // module methods //

  async onModuleInit() {
    await this.prisma.settings.upsert({
      where: { id: this.id },
      create: { id: this.id },
      update: {},
    })
  }

  // priv methods //

  private serializeTautulliRecord(record): TautulliSettings {
    const { tautulliUrl, tautulliApiKey, tautlliLibraryIds } = record

    return {
      tautulliUrl,
      tautulliApiKey,
      tautlliLibraryIds: tautlliLibraryIds?.split(',').map(Number) ?? [],
    }
  }

  // public methods //

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
   * Update general settings
   */
  async updateGeneral(settings: GeneralSettings): Promise<GeneralSettings> {
    try {
      const { enabled, syncDays, syncHour } = settings
      const data = { enabled, syncDays, syncHour }

      return this.update<GeneralSettings>({
        update: data,
        select: generalSettingsSelect,
      })
    } catch (e) {
      const error = new Error(`Failed to update general settings: ${e.message}`)
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
   * Update Radarr settings
   */
  async updateRadarr(settings: RadarrSettings): Promise<RadarrSettings> {
    try {
      const { radarrUrl, radarrApiKey } = settings
      const data = { radarrUrl, radarrApiKey }

      return this.update<RadarrSettings>({
        update: data,
        select: radarrSettingsSelect,
      })
    } catch (e) {
      const error = new Error(`Failed to update radarr settings: ${e.message}`)
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

  /**
   * Update Tautulli settings
   */
  async updateTautulli(settings: TautulliSettings): Promise<TautulliSettings> {
    try {
      const { tautulliUrl, tautulliApiKey, tautlliLibraryIds } = settings
      const data = {
        tautulliUrl,
        tautulliApiKey,
        tautlliLibraryIds: tautlliLibraryIds?.join(',') ?? undefined,
      }

      return this.update<TautulliSettings>({
        update: data,
        select: tautulliSettingsSelect,
      })
    } catch (e) {
      const error = new Error(
        `Failed to update tautulli settings: ${e.message}`,
      )
      this.logger.error(error.message)

      throw error
    }
  }

  // database methods //

  private async findFirst<T>(select: Prisma.SettingsSelect): Promise<T> {
    return this.prisma.settings.findFirst({
      where: { id: this.id },
      select,
    }) as T
  }

  private async update<T>(params: {
    update: Prisma.SettingsUpdateInput
    select: Prisma.SettingsSelect
  }): Promise<T> {
    const { update, select } = params

    return this.prisma.settings.update({
      where: { id: this.id },
      data: update,
      select,
    }) as T
  }
}
