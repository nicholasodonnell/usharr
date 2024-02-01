import { Module } from '@nestjs/common'

import { SettingsModule } from '../settings/settings.module'
import { SyncModule } from '../sync/sync.module'

import { TaskService } from './task.service'

@Module({
  controllers: [],
  exports: [TaskService],
  imports: [SettingsModule, SyncModule],
  providers: [TaskService],
})
export class TaskModule {}
