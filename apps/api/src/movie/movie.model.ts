import type { Movie as IMovie } from '@usharr/types'

import { ApiProperty } from '@nestjs/swagger'
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
  @IsNumber()
  @IsOptional()
  daysUntilDeletion: number | undefined

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
  @IsOptional()
  @Type(() => Rule)
  @ValidateNested({ each: true })
  matchedRule: Rule | undefined

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  metacriticRating: null | number

  @ApiProperty()
  @IsOptional()
  @IsString()
  poster: null | string

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  rottenTomatoesRating: null | number

  @ApiProperty()
  @IsArray()
  @Type(() => Tag)
  @ValidateNested({ each: true })
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
