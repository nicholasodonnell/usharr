import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

import { RadarrSettings } from '../settings/settings.model'

import { RadarrPing } from './radarr.model'
import { RadarrService } from './radarr.service'

@Controller('api/radarr')
export class RadarrController {
  constructor(private readonly radarr: RadarrService) {}

  @ApiOkResponse({ type: RadarrPing })
  @Get('ping')
  async getPing(): Promise<RadarrPing> {
    return await this.radarr.ping()
  }

  @ApiOkResponse({ type: RadarrPing })
  @Post('ping')
  async postPing(@Body() body: RadarrSettings): Promise<RadarrPing> {
    return await this.radarr.ping(body)
  }
}
