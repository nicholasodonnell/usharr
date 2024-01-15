import type {
  GeneralSettingsDTO as IGeneralSettingsDTO,
  RadarrSettingsDTO as IRadarrSettingsDTO,
  TautulliSettingsDTO as ITautulliSettingsDTO,
} from '@usharr/types'

import {
  GeneralSettings,
  RadarrSettings,
  TautulliSettings,
} from './Settings.model'

export class GeneralSettingsDTO
  extends GeneralSettings
  implements IGeneralSettingsDTO {}

export class RadarrSettingsDTO
  extends RadarrSettings
  implements IRadarrSettingsDTO {}

export class TautulliSettingsDTO
  extends TautulliSettings
  implements ITautulliSettingsDTO {}
