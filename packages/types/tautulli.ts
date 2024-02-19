export type TautulliPing = {
  success: boolean
}

export type TautulliGetHistoryResponse = {
  response: {
    data: {
      data: {
        date: number
        watched_status: number
        title: string
      }[]
    }
  }
}

export type TautulliHistory = {
  date: Date
  title: string
}

