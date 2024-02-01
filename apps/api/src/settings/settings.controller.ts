import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

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
import { SettingsService } from './settings.service'

@Controller('api/settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @ApiOkResponse({ type: GeneralSettings })
  @Get('general')
  async getGeneral(): Promise<GeneralSettings> {
    return await this.settings.getGeneral()
  }

  @ApiOkResponse({ type: RadarrSettings })
  @Get('radarr')
  async getRadarr(): Promise<RadarrSettings> {
    return await this.settings.getRadarr()
  }

  @ApiOkResponse({ type: TautulliSettings })
  @Get('tautulli')
  async getTautulli(): Promise<TautulliSettings> {
    return await this.settings.getTautulli()
  }

  @ApiOkResponse({ type: GeneralSettings })
  @Post('general')
  async updateGeneral(
    @Body() body: GeneralSettingsDTO,
  ): Promise<GeneralSettings> {
    return await this.settings.updateGeneral(body)
  }

  @ApiOkResponse({ type: RadarrSettings })
  @Post('radarr')
  async updateRadarr(@Body() body: RadarrSettingsDTO): Promise<RadarrSettings> {
    return await this.settings.updateRadarr(body)
  }

  @ApiOkResponse({ type: TautulliSettings })
  @Post('tautulli')
  async updateTautulli(
    @Body() body: TautulliSettingsDTO,
  ): Promise<TautulliSettings> {
    return await this.settings.updateTautulli(body)
  }
}
