import type { Sync as ISync, SyncType } from '@usharr/types'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class Sync implements ISync {
  @IsDate()
  @IsOptional()
  finishedAt: Date | null

  @IsNumber()
  @IsNotEmpty()
  id: number

  @IsDate()
  @IsNotEmpty()
  startedAt: Date

  @IsString()
  @IsNotEmpty()
  type: SyncType

  constructor(partial: Partial<Sync>) {
    Object.assign(this, partial)
  }
}
