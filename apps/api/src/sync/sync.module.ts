import { Module } from '@nestjs/common'

import { MovieModule } from '../movie/movie.module'
import { PrismaModule } from '../prisma/prisma.module'
import { RadarrModule } from '../radarr/radarr.module'
import { RuleModule } from '../rule/rule.module'
import { TagModule } from '../tag/tag.module'
import { TautulliModule } from '../tautulli/tautulli.module'

import { SyncController } from './sync.controller'
import { SyncService } from './sync.service'

@Module({
  imports: [
    MovieModule,
    PrismaModule,
    RadarrModule,
    RuleModule,
    TagModule,
    TautulliModule,
  ],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
