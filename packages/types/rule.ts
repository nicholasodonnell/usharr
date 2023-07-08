import { Tag } from './tag'

export type Rule = {
  id?: number
  name: string
  enabled: boolean
  downloadedDaysAgo: number | null
  watched: boolean | null
  watchedDaysAgo: number | null
  minimumImdbRating: number | null
  minimumTmdbRating: number | null
  minimumMetacriticRating: number | null
  minimumRottenTomatoesRating: number | null
  tags: Tag[]
}
