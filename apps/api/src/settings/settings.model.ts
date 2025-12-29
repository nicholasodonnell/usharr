import type {
  GeneralSettings as IGeneralSettings,
  RadarrSettings as IRadarrSettings,
  Settings as ISettings,
  TautulliSettings as ITautulliSettings,
} from '@usharr/types'

import { ApiProperty, PickType } from '@nestjs/swagger'
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

/* eslint-disable perfectionist/sort-modules */
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
  @IsBoolean()
  radarrAddImportListExclusion: boolean

  @ApiProperty()
  @IsOptional()
  @IsString()
  radarrApiKey: null | string

  @ApiProperty()
  @IsOptional()
  @IsString()
  radarrUrl: null | string

  @ApiProperty()
  @IsNumber()
  syncDays: number

  @ApiProperty()
  @IsNumber()
  syncHour: number

  @ApiProperty()
  @IsOptional()
  @IsString()
  tautulliApiKey: null | string

  @ApiProperty()
  @IsOptional()
  @IsString()
  tautulliUrl: null | string

  @ApiProperty()
  @IsBoolean()
  treatSoftMatchAsUnmonitored: boolean

  @ApiProperty()
  @IsDate()
  updatedAt: Date

  constructor(partial: Partial<Settings>) {
    Object.assign(this, partial)
  }
}

export class GeneralSettings
  extends PickType(Settings, [
    'enabled',
    'syncDays',
    'syncHour',
    'treatSoftMatchAsUnmonitored',
  ])
  implements IGeneralSettings
{
  constructor(partial: Partial<GeneralSettings>) {
    super()
    Object.assign(this, partial)
  }
}

export class RadarrSettings
  extends PickType(Settings, [
    'radarrApiKey',
    'radarrUrl',
    'radarrAddImportListExclusion',
  ])
  implements IRadarrSettings
{
  constructor(partial: Partial<RadarrSettings>) {
    super()
    Object.assign(this, partial)
  }
}

export class TautulliSettings
  extends PickType(Settings, ['tautulliApiKey', 'tautulliUrl'])
  implements ITautulliSettings
{
  constructor(partial: Partial<TautulliSettings>) {
    super()
    Object.assign(this, partial)
  }
}
