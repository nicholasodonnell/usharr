import { OmitType } from '@nestjs/swagger'
import type { RuleDTO as IRuleDTO } from '@usharr/types'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'

import { TagDTO } from '../tag/tag.dto'

import { Rule } from './rule.model'

export class RuleDTO
  extends OmitType(Rule, ['createdAt', 'id', 'tags', 'updatedAt'])
  implements IRuleDTO
{
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => TagDTO)
  tags: TagDTO[]
}
