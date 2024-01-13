import { Module } from '@nestjs/common'

import { SettingsModule } from '../settings/settings.module'

import { RadarrController } from './radarr.controller'
import { RadarrService } from './radarr.service'

@Module({
  controllers: [RadarrController],
  exports: [RadarrService],
  imports: [SettingsModule],
  providers: [RadarrService],
})
export class RadarrModule {}
