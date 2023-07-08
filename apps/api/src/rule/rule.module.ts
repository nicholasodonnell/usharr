import { Module } from '@nestjs/common'

import { PrismaModule } from '../prisma/prisma.module'

import { RuleController } from './rule.controller'
import { RuleService } from './rule.service'

@Module({
  imports: [PrismaModule],
  controllers: [RuleController],
  providers: [RuleService],
  exports: [RuleService],
})
export class RuleModule {}
