import { Module } from '@nestjs/common'

import { SettingsModule } from '../settings/settings.module'

import { TautulliController } from './tautulli.controller'
import { TautulliService } from './tautulli.service'

@Module({
  controllers: [TautulliController],
  exports: [TautulliService],
  imports: [SettingsModule],
  providers: [TautulliService],
})
export class TautulliModule {}
