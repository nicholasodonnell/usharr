import { Module } from '@nestjs/common'

import { PrismaModule } from '../prisma/prisma.module'

import { TagController } from './tag.controller'
import { TagService } from './tag.service'

@Module({
  imports: [PrismaModule],
  controllers: [TagController],
  providers: [TagService],
  exports: [TagService],
})
export class TagModule {}
