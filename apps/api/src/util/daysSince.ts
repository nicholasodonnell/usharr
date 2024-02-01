const ONE_DAY_MS = 1000 * 60 * 60 * 24

export function daysSince(date: Date): number {
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  return Math.floor(diff / ONE_DAY_MS)
}
