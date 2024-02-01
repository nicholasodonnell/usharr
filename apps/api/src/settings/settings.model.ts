import { ApiProperty, PickType } from '@nestjs/swagger'
import type {
  GeneralSettings as IGeneralSettings,
  RadarrSettings as IRadarrSettings,
  Settings as ISettings,
  TautulliSettings as ITautulliSettings,
} from '@usharr/types'
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class Settings implements ISettings {
  @ApiProperty()
  @IsDate()
  createdAt: Date

  @ApiProperty()
  @IsBoolean()
  enabled: boolean

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number

  @ApiProperty()
  @IsString()
  @IsOptional()
  radarrApiKey: null | string

  @ApiProperty()
  @IsString()
  @IsOptional()
  radarrUrl: null | string

  @ApiProperty()
  @IsNumber()
  syncDays: number

  @ApiProperty()
  @IsNumber()
  syncHour: number

  @ApiProperty()
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tautlliLibraryIds: null | number[]

  @ApiProperty()
  @IsString()
  @IsOptional()
  tautulliApiKey: null | string

  @ApiProperty()
  @IsString()
  @IsOptional()
  tautulliUrl: null | string

  @ApiProperty()
  @IsDate()
  updatedAt: Date

  constructor(partial: Partial<Settings>) {
    Object.assign(this, partial)
  }
}

export class GeneralSettings
  extends PickType(Settings, ['enabled', 'syncDays', 'syncHour'])
  implements IGeneralSettings
{
  constructor(partial: Partial<GeneralSettings>) {
    super()
    Object.assign(this, partial)
  }
}

export class RadarrSettings
  extends PickType(Settings, ['radarrApiKey', 'radarrUrl'])
  implements IRadarrSettings
{
  constructor(partial: Partial<RadarrSettings>) {
    super()
    Object.assign(this, partial)
  }
}

export class TautulliSettings
  extends PickType(Settings, [
    'tautlliLibraryIds',
    'tautulliApiKey',
    'tautulliUrl',
  ])
  implements ITautulliSettings
{
  constructor(partial: Partial<TautulliSettings>) {
    super()
    Object.assign(this, partial)
  }
}
