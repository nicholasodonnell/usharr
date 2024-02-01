import { Rule } from './rule'
import { Tag, TagDTO } from './tag'

export type Movie = {
  alternativeTitles: string[]
  appearsInList: boolean
  createdAt: Date
  daysUntilDeletion: number | null
  deleted: boolean
  deletedAt: Date | null
  downloadedAt: Date
  id: number
  ignored: boolean
  imdbRating: number | null
  lastWatchedAt: Date | null
  matchedRule: Rule | null
  metacriticRating: number | null
  poster: string | null
  rottenTomatoesRating: number | null
  tags: Tag[]
  title: string
  tmdbId: number
  tmdbRating: number | null
  updatedAt: Date
  watched: boolean
}

export type MovieDTO = Omit<Movie, 'createdAt' | 'updatedAt' | 'daysUntilDeletion' | 'matchedRule' | 'tags'> & {
  tags: TagDTO[]
}
