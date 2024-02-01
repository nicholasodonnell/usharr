import { ApiProperty } from '@nestjs/swagger'
import type {
  TautulliLibrary as ITautulliLibrary,
  TautulliPing as ITautulliPing,
} from '@usharr/types'
import { Type } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

export class TautulliLibrary implements ITautulliLibrary {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  section_id: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  section_name: string
}

export class TautulliPing implements ITautulliPing {
  @ApiProperty()
  @IsArray()
  @IsOptional()
  @Type(() => TautulliLibrary)
  @ValidateNested({ each: true })
  libraries?: TautulliLibrary[]

  @ApiProperty()
  @IsBoolean()
  success: boolean

  constructor(partial: Partial<TautulliPing>) {
    Object.assign(this, partial)
  }
}
