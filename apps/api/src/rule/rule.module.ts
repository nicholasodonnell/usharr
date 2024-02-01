import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

import { RuleController } from './rule.controller'
import { RuleService } from './rule.service'

@Module({
  controllers: [RuleController],
  exports: [RuleService],
  imports: [],
  providers: [PrismaService, RuleService],
})
export class RuleModule {}
