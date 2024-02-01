import { ApiProperty } from '@nestjs/swagger'
import type { Tag as ITag } from '@usharr/types'
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class Tag implements ITag {
  @ApiProperty()
  @IsDate()
  createdAt: Date

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @IsDate()
  updatedAt: Date

  constructor(partial: Partial<Tag>) {
    Object.assign(this, partial)
  }
}
