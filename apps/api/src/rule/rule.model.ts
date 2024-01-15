import type { Rule as IRule } from '@usharr/types'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import { Tag } from '../tag/tag.model'

export class Rule implements IRule {
  @IsBoolean()
  @IsOptional()
  appearsInList: boolean | null

  @IsDate()
  createdAt: Date

  @IsOptional()
  @IsNumber()
  downloadedDaysAgo: null | number

  @IsBoolean()
  enabled: boolean

  @IsNumber()
  id: number

  @IsOptional()
  @IsNumber()
  minimumImdbRating: null | number

  @IsOptional()
  @IsNumber()
  minimumMetacriticRating: null | number

  @IsOptional()
  @IsNumber()
  minimumRottenTomatoesRating: null | number

  @IsOptional()
  @IsNumber()
  minimumTmdbRating: null | number

  @IsString()
  name: string

  @IsArray()
  @ValidateNested()
  @Type(() => Tag)
  tags: Tag[]

  @IsDate()
  updatedAt: Date

  @IsOptional()
  @IsBoolean()
  watched: boolean | null

  @IsOptional()
  @IsNumber()
  watchedDaysAgo: null | number

  constructor(partial: Partial<Rule>) {
    Object.assign(this, partial)
  }
}
