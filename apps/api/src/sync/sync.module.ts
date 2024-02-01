import { Module } from '@nestjs/common'

import { MovieModule } from '../movie/movie.module'
import { PrismaService } from '../prisma.service'
import { RadarrModule } from '../radarr/radarr.module'
import { RuleModule } from '../rule/rule.module'
import { TagModule } from '../tag/tag.module'
import { TautulliModule } from '../tautulli/tautulli.module'

import { SyncController } from './sync.controller'
import { SyncService } from './sync.service'

@Module({
  controllers: [SyncController],
  exports: [SyncService],
  imports: [MovieModule, RadarrModule, RuleModule, TagModule, TautulliModule],
  providers: [PrismaService, SyncService],
})
export class SyncModule {}
