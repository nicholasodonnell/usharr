export type SyncType = 'FULL' | 'PARTIAL'

export type Sync = {
  finishedAt: Date | null
  id: number
  startedAt: Date
  type: SyncType
}
