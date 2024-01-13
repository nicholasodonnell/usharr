import { Controller, HttpCode, Post } from '@nestjs/common'

import { SyncService } from './sync.service'

@Controller('api/sync')
export class SyncController {
  constructor(private readonly sync: SyncService) {}

  @Post('full')
  @HttpCode(202)
  async full(): Promise<void> {
    await this.sync.full()
  }

  @Post('partial')
  @HttpCode(202)
  async partial(): Promise<void> {
    await this.sync.partial()
  }

  @Post('radarr')
  @HttpCode(202)
  async radarr(): Promise<void> {
    await this.sync.tags()
    await this.sync.movies()
  }

  @Post('tautulli')
  @HttpCode(202)
  async tautulli(): Promise<void> {
    await this.sync.watchHistory()
  }
}
