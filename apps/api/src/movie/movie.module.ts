import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'
import { RuleModule } from '../rule/rule.module'
import { SettingsModule } from '../settings/settings.module'

import { MovieController } from './movie.controller'
import { MovieService } from './movie.service'

@Module({
  controllers: [MovieController],
  exports: [MovieService],
  imports: [RuleModule, SettingsModule],
  providers: [MovieService, PrismaService],
})
export class MovieModule {}
