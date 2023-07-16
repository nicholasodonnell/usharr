import { Rule } from './rule'
import { Tag } from './tag'

export type Movie = {
  // schema
  id: number
  title: string
  alternativeTitles: string[]
  tmdbId: number
  poster: string | null
  watched: boolean
  lastWatchedAt: Date | null
  ignored: boolean
  deleted: boolean
  downloadedAt: Date
  imdbRating: number | null
  tmdbRating: number | null
  metacriticRating: number | null
  rottenTomatoesRating: number | null
  appearsInList: boolean
  tags: Tag[]
  deletedAt: Date | null

  // computed
  daysUntilDeletion?: number | null
  matchedRule?: Rule | null
}
