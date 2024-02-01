import { Tag, TagDTO } from './tag'

export type Rule = {
  appearsInList: boolean | null
  createdAt: Date
  downloadedDaysAgo: number | null
  enabled: boolean
  id: number
  minimumImdbRating: number | null
  minimumMetacriticRating: number | null
  minimumRottenTomatoesRating: number | null
  minimumTmdbRating: number | null
  name: string
  tags: Tag[]
  updatedAt: Date
  watched: boolean | null
  watchedDaysAgo: number | null
}

export type RuleDTO = Omit<Rule, 'id' | 'createdAt' | 'updatedAt' | 'tags'> & {
  tags: TagDTO[]
}
