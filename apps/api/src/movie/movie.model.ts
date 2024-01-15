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
  @IsArray()
  @IsString({ each: true })
  alternativeTitles: string[]

  @IsBoolean()
  appearsInList: boolean

  @IsDate()
  createdAt: Date

  // computed
  @IsOptional()
  @IsNumber()
  daysUntilDeletion: null | number

  @IsBoolean()
  deleted: boolean

  @IsDate()
  @IsOptional()
  deletedAt: Date | null

  @IsDate()
  downloadedAt: Date

  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsBoolean()
  ignored: boolean

  @IsNumber()
  @IsOptional()
  imdbRating: null | number

  @IsDate()
  @IsOptional()
  lastWatchedAt: Date | null

  // computed
  @Type(() => Rule)
  @IsOptional()
  matchedRule: Rule | null

  @IsNumber()
  @IsOptional()
  metacriticRating: null | number

  @IsString()
  @IsOptional()
  poster: null | string

  @IsNumber()
  @IsOptional()
  rottenTomatoesRating: null | number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Tag)
  tags: Tag[]

  @IsString()
  title: string

  @IsNumber()
  tmdbId: number

  @IsNumber()
  @IsOptional()
  tmdbRating: null | number

  @IsDate()
  updatedAt: Date

  @IsBoolean()
  watched: boolean
  constructor(partial: Partial<Movie>) {
    Object.assign(this, partial)
  }
}
