export type Settings = {
  createdAt: Date
  enabled: boolean
  id: number
  radarrAddImportListExclusion: boolean
  radarrApiKey: string | null
  radarrUrl: string | null
  syncDays: number
  syncHour: number
  tautulliApiKey: string | null
  tautulliUrl: string | null
  updatedAt: Date
}

export type GeneralSettings = Pick<Settings, 'enabled' | 'syncDays' | 'syncHour'>
export type RadarrSettings = Pick<Settings, 'radarrApiKey' | 'radarrUrl' | 'radarrAddImportListExclusion'>
export type TautulliSettings = Pick<Settings, 'tautulliApiKey' | 'tautulliUrl'>

export type SettingsDTO = Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>
export type GeneralSettingsDTO = Pick<SettingsDTO, 'enabled' | 'syncDays' | 'syncHour'>
export type RadarrSettingsDTO = Pick<SettingsDTO, 'radarrApiKey' | 'radarrUrl' | 'radarrAddImportListExclusion'>
export type TautulliSettingsDTO = Pick<SettingsDTO, 'tautulliApiKey' | 'tautulliUrl'>
