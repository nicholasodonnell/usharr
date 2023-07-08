import { Body, Controller, Get, Post } from '@nestjs/common'
import type { TautulliPing, TautulliSettings } from '@usharr/types'

import { TautulliService } from './tautulli.service'

@Controller('api/tautulli')
export class TautulliController {
  constructor(private readonly tautulli: TautulliService) {}

  @Post('ping')
  async postPing(@Body() body: TautulliSettings): Promise<TautulliPing> {
    return await this.tautulli.ping(body)
  }

  @Get('ping')
  async getPing(): Promise<TautulliPing> {
    return await this.tautulli.ping()
  }
}
