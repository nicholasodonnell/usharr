import type { Sync as ISync, SyncType } from '@usharr/types'

import { ApiProperty } from '@nestjs/swagger'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class Sync implements ISync {
  @ApiProperty()
  @IsDate()
  @IsOptional()
  finishedAt: Date | null

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  startedAt: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  type: SyncType

  constructor(partial: Partial<Sync>) {
    Object.assign(this, partial)
  }
}
