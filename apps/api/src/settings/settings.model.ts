import { ApiProperty, PickType } from '@nestjs/swagger'
import type {
  GeneralSettings as IGeneralSettings,
  RadarrSettings as IRadarrSettings,
  Settings as ISettings,
  TautulliSettings as ITautulliSettings,
} from '@usharr/types'
import {
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
  @IsBoolean()
  radarrAddImportListExclusion: boolean

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
  @IsString()
  @IsOptional()
  tautulliApiKey: null | string

  @ApiProperty()
  @IsString()
  @IsOptional()
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
