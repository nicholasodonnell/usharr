import { OmitType } from '@nestjs/swagger'
import type { MovieDTO as IMovieDTO } from '@usharr/types'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'

import { TagDTO } from '../tag/tag.dto'

import { Movie } from './movie.model'

export class MovieDTO
  extends OmitType(Movie, [
    'createdAt',
    'updatedAt',
    'daysUntilDeletion',
    'matchedRule',
    'tags',
  ])
  implements IMovieDTO
{
  @IsArray()
  @IsOptional()
  @Type(() => TagDTO)
  @ValidateNested()
  tags: TagDTO[]
}
