export type GeneralSettings = {
  enabled: boolean
  syncDays: number
  syncHour: number
}

export type RadarrSettings = {
  radarrUrl: string | null
  radarrApiKey: string | null
}

export type TautulliSettings = {
  tautulliUrl: string | null
  tautulliApiKey: string | null
  tautlliLibraryId: number | null
}

export type Settings = GeneralSettings & RadarrSettings & TautulliSettings
