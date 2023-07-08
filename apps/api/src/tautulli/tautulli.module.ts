import { Module } from '@nestjs/common'

import { SettingsModule } from '../settings/settings.module'

import { TautulliController } from './tautulli.controller'
import { TautulliService } from './tautulli.service'

@Module({
  imports: [SettingsModule],
  controllers: [TautulliController],
  providers: [TautulliService],
  exports: [TautulliService],
})
export class TautulliModule {}
