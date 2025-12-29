import { Controller, HttpCode, Post } from '@nestjs/common'

import { SyncService } from './sync.service'

@Controller('api/sync')
export class SyncController {
  constructor(private readonly sync: SyncService) {}

  @HttpCode(202)
  @Post('full')
  async full(): Promise<void> {
    await this.sync.full()
  }

  @HttpCode(202)
  @Post('partial')
  async partial(): Promise<void> {
    await this.sync.partial()
  }

  @HttpCode(202)
  @Post('radarr')
  async radarr(): Promise<void> {
    await this.sync.tags()
    await this.sync.movies()
  }

  @HttpCode(202)
  @Post('tautulli')
  async tautulli(): Promise<void> {
    await this.sync.watchHistory()
  }
}
