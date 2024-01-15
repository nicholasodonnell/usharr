import type { Tag as ITag } from '@usharr/types'
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class Tag implements ITag {
  @IsDate()
  createdAt: Date

  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsNotEmpty()
  @IsString()
  name: string

  @IsDate()
  updatedAt: Date

  constructor(partial: Partial<Tag>) {
    Object.assign(this, partial)
  }
}
