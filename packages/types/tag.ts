export type Tag = {
  createdAt: Date
  id: number
  name: string
  updatedAt: Date
}

export type TagDTO = Omit<Tag, 'createdAt' | 'updatedAt'>
