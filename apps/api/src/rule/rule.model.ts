import { ApiProperty } from '@nestjs/swagger'
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
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  appearsInList: boolean | null

  @ApiProperty()
  @IsDate()
  createdAt: Date

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  downloadedDaysAgo: null | number

  @ApiProperty()
  @IsBoolean()
  enabled: boolean

  @ApiProperty()
  @IsNumber()
  id: number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minimumImdbRating: null | number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minimumMetacriticRating: null | number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minimumRottenTomatoesRating: null | number

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  minimumTmdbRating: null | number

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @ValidateNested()
  @Type(() => Tag)
  tags: Tag[]

  @ApiProperty()
  @IsDate()
  updatedAt: Date

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  watched: boolean | null

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  watchedDaysAgo: null | number

  constructor(partial: Partial<Rule>) {
    Object.assign(this, partial)
  }
}
