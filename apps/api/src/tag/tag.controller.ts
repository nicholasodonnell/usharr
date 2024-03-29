import { Controller, Get } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'

import { Tag } from './tag.model'
import { TagService } from './tag.service'

@Controller('api/tags')
export class TagController {
  constructor(private readonly tag: TagService) {}

  @ApiOkResponse({ type: [Tag] })
  @Get()
  async get(): Promise<Tag[]> {
    return await this.tag.getAll()
  }
}
