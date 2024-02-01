import { ApiProperty } from '@nestjs/swagger'
import type { RadarrPing as IRadarrPing } from '@usharr/types'
import { IsBoolean } from 'class-validator'

export class RadarrPing implements IRadarrPing {
  @ApiProperty()
  @IsBoolean()
  hasRecycleBin?: boolean

  @ApiProperty()
  @IsBoolean()
  success: boolean

  constructor(partial: Partial<RadarrPing>) {
    Object.assign(this, partial)
  }
}
