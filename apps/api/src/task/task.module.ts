import { Module } from '@nestjs/common'

import { SettingsModule } from '../settings/settings.module'
import { SyncModule } from '../sync/sync.module'

import { TaskService } from './task.service'

@Module({
  imports: [SettingsModule, SyncModule],
  controllers: [],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
