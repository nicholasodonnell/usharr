import { PickType } from '@nestjs/swagger'
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
  @IsDate()
  createdAt: Date

  @IsBoolean()
  enabled: boolean

  @IsNotEmpty()
  @IsNumber()
  id: number

  @IsString()
  @IsOptional()
  radarrApiKey: null | string

  @IsString()
  @IsOptional()
  radarrUrl: null | string

  @IsNumber()
  syncDays: number

  @IsNumber()
  syncHour: number

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tautlliLibraryIds: null | number[]

  @IsString()
  @IsOptional()
  tautulliApiKey: null | string

  @IsString()
  @IsOptional()
  tautulliUrl: null | string

  @IsDate()
  updatedAt: Date

  constructor(partial: Partial<Settings>) {
    Object.assign(this, partial)
  }
}

export class GeneralSettings
  extends PickType(Settings, ['enabled', 'syncDays', 'syncHour'])
  implements IGeneralSettings {}

export class RadarrSettings
  extends PickType(Settings, ['radarrApiKey', 'radarrUrl'])
  implements IRadarrSettings {}

export class TautulliSettings
  extends PickType(Settings, [
    'tautlliLibraryIds',
    'tautulliApiKey',
    'tautulliUrl',
  ])
  implements ITautulliSettings {}
