import { ApiProperty } from '@nestjs/swagger'
import type { Movie as IMovie } from '@usharr/types'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

import { Rule } from '../rule/rule.model'
import { Tag } from '../tag/tag.model'

export class Movie implements IMovie {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  alternativeTitles: string[]

  @ApiProperty()
  @IsBoolean()
  appearsInList: boolean

  @ApiProperty()
  @IsDate()
  createdAt: Date

  // computed
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  daysUntilDeletion: null | number

  @ApiProperty()
  @IsBoolean()
  deleted: boolean

  @ApiProperty()
  @IsDate()
  @IsOptional()
  deletedAt: Date | null

  @ApiProperty()
  @IsDate()
  downloadedAt: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty()
  @IsBoolean()
  ignored: boolean

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  imdbRating: null | number

  @ApiProperty()
  @IsDate()
  @IsOptional()
  lastWatchedAt: Date | null

  // computed
  @ApiProperty()
  @Type(() => Rule)
  @IsOptional()
  @ValidateNested({ each: true })
  matchedRule: Rule | null

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  metacriticRating: null | number

  @ApiProperty()
  @IsString()
  @IsOptional()
  poster: null | string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  rottenTomatoesRating: null | number

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Tag)
  tags: Tag[]

  @ApiProperty()
  @IsString()
  title: string

  @ApiProperty()
  @IsNumber()
  tmdbId: number

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  tmdbRating: null | number

  @ApiProperty()
  @IsDate()
  updatedAt: Date

  @ApiProperty()
  @IsBoolean()
  watched: boolean

  constructor(partial: Partial<Movie>) {
    Object.assign(this, partial)
  }
}
