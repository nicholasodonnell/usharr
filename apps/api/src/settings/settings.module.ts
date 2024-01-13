import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

import { SettingsController } from './settings.controller'
import { SettingsService } from './settings.service'

@Module({
  controllers: [SettingsController],
  exports: [SettingsService],
  imports: [],
  providers: [PrismaService, SettingsService],
})
export class SettingsModule {}
