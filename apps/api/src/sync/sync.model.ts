import { ApiProperty } from '@nestjs/swagger'
import type { Sync as ISync, SyncType } from '@usharr/types'
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
  @IsNumber()
  @IsNotEmpty()
  id: number

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  startedAt: Date

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: SyncType

  constructor(partial: Partial<Sync>) {
    Object.assign(this, partial)
  }
}
