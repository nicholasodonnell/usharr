export type Settings = {
  createdAt: Date
  enabled: boolean
  id: number
  radarrApiKey: string | null
  radarrUrl: string | null
  syncDays: number
  syncHour: number
  tautlliLibraryIds: number[] | null
  tautulliApiKey: string | null
  tautulliUrl: string | null
  updatedAt: Date
}

export type GeneralSettings = Pick<Settings, 'enabled' | 'syncDays' | 'syncHour'>
export type RadarrSettings = Pick<Settings, 'radarrApiKey' | 'radarrUrl'>
export type TautulliSettings = Pick<Settings, 'tautlliLibraryIds' | 'tautulliApiKey' | 'tautulliUrl'>

export type SettingsDTO = Omit<Settings, 'id' | 'createdAt' | 'updatedAt'>
export type GeneralSettingsDTO = Pick<SettingsDTO, 'enabled' | 'syncDays' | 'syncHour'>
export type RadarrSettingsDTO = Pick<SettingsDTO, 'radarrApiKey' | 'radarrUrl'>
export type TautulliSettingsDTO = Pick<SettingsDTO, 'tautlliLibraryIds' | 'tautulliApiKey' | 'tautulliUrl'>
