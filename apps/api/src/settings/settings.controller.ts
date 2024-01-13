import { Body, Controller, Get, Post } from '@nestjs/common'
import type {
  GeneralSettings,
  RadarrSettings,
  TautulliSettings,
} from '@usharr/types'

import { SettingsService } from './settings.service'

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get('general')
  async getGeneral(): Promise<GeneralSettings> {
    return await this.settings.getGeneral()
  }

  @Get('radarr')
  async getRadarr(): Promise<RadarrSettings> {
    return await this.settings.getRadarr()
  }

  @Get('tautulli')
  async getTautulli(): Promise<TautulliSettings> {
    return await this.settings.getTautulli()
  }

  @Post('general')
  async updateGeneral(@Body() body: GeneralSettings): Promise<GeneralSettings> {
    return await this.settings.updateGeneral(body)
  }

  @Post('radarr')
  async updateRadarr(@Body() body: RadarrSettings): Promise<RadarrSettings> {
    return await this.settings.updateRadarr(body)
  }

  @Post('tautulli')
  async updateTautulli(
    @Body() body: TautulliSettings,
  ): Promise<TautulliSettings> {
    return await this.settings.updateTautulli(body)
  }
}
