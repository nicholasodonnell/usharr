import { ApiProperty } from '@nestjs/swagger'
import type { TautulliPing as ITautulliPing } from '@usharr/types'
import { IsBoolean } from 'class-validator'

export class TautulliPing implements ITautulliPing {
  @ApiProperty()
  @IsBoolean()
  success: boolean

  constructor(partial: Partial<TautulliPing>) {
    Object.assign(this, partial)
  }
}
