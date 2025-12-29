import type { Rule as IRule } from '@usharr/types'

import { ApiProperty } from '@nestjs/swagger'
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
  @IsNumber()
  @IsOptional()
  downloadedDaysAgo: null | number

  @ApiProperty()
  @IsBoolean()
  enabled: boolean

  @ApiProperty()
  @IsNumber()
  id: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  minimumImdbRating: null | number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  minimumMetacriticRating: null | number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  minimumRottenTomatoesRating: null | number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  minimumTmdbRating: null | number

  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @Type(() => Tag)
  @ValidateNested()
  tags: Tag[]

  @ApiProperty()
  @IsDate()
  updatedAt: Date

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  watched: boolean | null

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  watchedDaysAgo: null | number

  constructor(partial: Partial<Rule>) {
    Object.assign(this, partial)
  }
}
