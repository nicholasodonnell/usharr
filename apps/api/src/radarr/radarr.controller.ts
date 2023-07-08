import { Body, Controller, Get, Post } from '@nestjs/common'
import type { RadarrPing, RadarrSettings } from '@usharr/types'

import { RadarrService } from './radarr.service'

@Controller('api/radarr')
export class RadarrController {
  constructor(private readonly radarr: RadarrService) {}

  @Post('ping')
  async postPing(@Body() body: RadarrSettings): Promise<RadarrPing> {
    return await this.radarr.ping(body)
  }

  @Get('ping')
  async getPing(): Promise<RadarrPing> {
    return await this.radarr.ping()
  }
}
