import type { TagDTO as ITagDTO } from '@usharr/types'

import { OmitType } from '@nestjs/swagger'

import { Tag } from './tag.model'

export class TagDTO
  extends OmitType(Tag, ['createdAt', 'updatedAt'])
  implements ITagDTO {}
