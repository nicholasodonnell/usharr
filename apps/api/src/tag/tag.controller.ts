import { Controller, Get } from '@nestjs/common'

import { Tag } from './tag.model'
import { TagService } from './tag.service'

@Controller('api/tags')
export class TagController {
  constructor(private readonly tag: TagService) {}

  @Get()
  async get(): Promise<Tag[]> {
    return await this.tag.getAll()
  }
}
