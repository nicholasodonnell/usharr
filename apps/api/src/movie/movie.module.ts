import { Module } from '@nestjs/common'

import { PrismaModule } from '../prisma/prisma.module'
import { RuleModule } from '../rule/rule.module'
import { UtilModule } from '../util/util.module'

import { MovieController } from './movie.controller'
import { MovieService } from './movie.service'

@Module({
  imports: [PrismaModule, RuleModule, UtilModule],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
