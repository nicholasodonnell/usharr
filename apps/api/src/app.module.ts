import { join } from 'path'

import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'

import { MovieModule } from './movie/movie.module'
import { RadarrModule } from './radarr/radarr.module'
import { RuleModule } from './rule/rule.module'
import { SettingsModule } from './settings/settings.module'
import { SyncModule } from './sync/sync.module'
import { TagModule } from './tag/tag.module'
import { TaskModule } from './task/task.module'
import { TautulliModule } from './tautulli/tautulli.module'

@Module({
  controllers: [],
  imports: [
    MovieModule,
    RadarrModule,
    RuleModule,
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    SettingsModule,
    SyncModule,
    TagModule,
    TaskModule,
    TautulliModule,
  ],
  providers: [],
})
export class AppModule {}
