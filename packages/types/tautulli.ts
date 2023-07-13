export type TautulliPing = {
  success: boolean
  libraries?: TautulliLibrary[]
}

export type TautulliLibrary = {
  section_id: number
  section_name: string
}

export type TautulliMediaInfo = {
  title: string
  last_played: number
  play_count: number
}

export type TautulliWatchHistory = {
  watched: boolean
  lastWatchedAt: Date
}

export type TautulliGetLibraryNamesResponse = {
  response: {
    result: string
    message: string | null
    data: {
      section_id: number
      section_name: string
      section_type: string
      agent: string
    }[]
  }
}

export type TautulliGetLibraryMediaInfoResponse = {
  response: {
    result: string
    message: string | null
    data: {
      recordsFiltered: number
      recordsTotal: number
      data: TautulliMediaInfo[]
    }
  }
}

export type TautulliHistoryRecord = {
  watched_status: number
  title: string
}

