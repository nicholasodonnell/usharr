import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

import { TautulliSettings } from '../settings/settings.model'

import { TautulliPing } from './tautulli.model'
import { TautulliService } from './tautulli.service'

@Controller('api/tautulli')
export class TautulliController {
  constructor(private readonly tautulli: TautulliService) {}

  @ApiOkResponse({ type: TautulliPing })
  @Get('ping')
  async getPing(): Promise<TautulliPing> {
    return await this.tautulli.ping()
  }

  @ApiOkResponse({ type: TautulliPing })
  @Post('ping')
  async postPing(@Body() body: TautulliSettings): Promise<TautulliPing> {
    return await this.tautulli.ping(body)
  }
}
