import { Module } from '@nestjs/common'

import { PrismaService } from '../prisma.service'

import { TagController } from './tag.controller'
import { TagService } from './tag.service'

@Module({
  controllers: [TagController],
  exports: [TagService],
  imports: [],
  providers: [PrismaService, TagService],
})
export class TagModule {}
