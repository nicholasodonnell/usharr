import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { PrismaService } from '../prisma.service'

import {
  GeneralSettingsDTO,
  RadarrSettingsDTO,
  TautulliSettingsDTO,
} from './settings.dto'
import {
  GeneralSettings,
  RadarrSettings,
  TautulliSettings,
} from './settings.model'

@Injectable()
export class SettingsService implements OnModuleInit {
  private readonly id = 1
  private readonly logger = new Logger(SettingsService.name)
  readonly generalSettingsSelect: Prisma.SettingsSelect = {
    enabled: true,
    syncDays: true,
    syncHour: true,
  }
  readonly radarrSettingsSelect: Prisma.SettingsSelect = {
    radarrAddImportListExclusion: true,
    radarrApiKey: true,
    radarrUrl: true,
  }
  readonly tautulliSettingsSelect: Prisma.SettingsSelect = {
    tautlliLibraryIds: true,
    tautulliApiKey: true,
    tautulliUrl: true,
  }

  constructor(private prisma: PrismaService) {}

  private async findFirst<T>(select: Prisma.SettingsSelect): Promise<T> {
    return this.prisma.settings.findFirst({
      select,
      where: { id: this.id },
    }) as T
  }

  private serializeTautulliRecord(record): TautulliSettings {
    const { tautlliLibraryIds, tautulliApiKey, tautulliUrl } = record

    return new TautulliSettings({
      tautlliLibraryIds: tautlliLibraryIds?.split(',').map(Number) ?? [],
      tautulliApiKey,
      tautulliUrl,
    })
  }

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
      const record = await this.findFirst<GeneralSettings>(
        this.generalSettingsSelect,
      )

      return new GeneralSettings(record)
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
      const record = await this.findFirst<RadarrSettings>(
        this.radarrSettingsSelect,
      )

      return new RadarrSettings(record)
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
        this.tautulliSettingsSelect,
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
  async updateGeneral(settings: GeneralSettingsDTO): Promise<GeneralSettings> {
    try {
      const { enabled, syncDays, syncHour } = settings
      const data = { enabled, syncDays, syncHour }

      const record = await this.update<GeneralSettings>({
        select: this.generalSettingsSelect,
        update: data,
      })

      return new GeneralSettings(record)
    } catch (e) {
      const error = new Error(`Failed to update general settings: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Update Radarr settings
   */
  async updateRadarr(settings: RadarrSettingsDTO): Promise<RadarrSettings> {
    try {
      const { radarrAddImportListExclusion, radarrApiKey, radarrUrl } = settings
      const data = { radarrAddImportListExclusion, radarrApiKey, radarrUrl }

      const record = await this.update<RadarrSettings>({
        select: this.radarrSettingsSelect,
        update: data,
      })

      return new RadarrSettings(record)
    } catch (e) {
      const error = new Error(`Failed to update radarr settings: ${e.message}`)
      this.logger.error(error.message)

      throw error
    }
  }

  /**
   * Update Tautulli settings
   */
  async updateTautulli(
    settings: TautulliSettingsDTO,
  ): Promise<TautulliSettings> {
    try {
      const { tautlliLibraryIds, tautulliApiKey, tautulliUrl } = settings
      const data = {
        tautlliLibraryIds: tautlliLibraryIds?.join(',') ?? undefined,
        tautulliApiKey,
        tautulliUrl,
      }

      const record = await this.update<TautulliSettings>({
        select: this.tautulliSettingsSelect,
        update: data,
      })

      return this.serializeTautulliRecord(record)
    } catch (e) {
      const error = new Error(
        `Failed to update tautulli settings: ${e.message}`,
      )
      this.logger.error(error.message)

      throw error
    }
  }
}
