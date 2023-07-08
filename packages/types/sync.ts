export type SyncType = 'FULL' | 'PARTIAL'

export type Sync = {
  id: number
  type: SyncType
  startedAt: Date
  finishedAt: Date | null
}
