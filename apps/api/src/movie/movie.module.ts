import { Module } from '@nestjs/common'

import { PrismaModule } from '../prisma/prisma.module'
import { RuleModule } from '../rule/rule.module'

import { MovieController } from './movie.controller'
import { MovieService } from './movie.service'

@Module({
  imports: [PrismaModule, RuleModule],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
