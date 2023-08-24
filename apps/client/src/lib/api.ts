import axios from 'axios'
import type { AxiosInstance, AxiosResponse, Method } from 'axios'

export type Request<Data> = {
  url: string
  params?: Record<string, unknown>
  data?: Data
  method?: Method
}

export type API = <T>(Request) => Promise<T>

const request: AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/'
      : `http://${window.location.hostname}:3001`,
})

export default async function api<Data, Response = Data>({
  data,
  method = 'GET',
  params = {},
  url,
}: Request<Data>): Promise<Response> {
  try {
    const response: AxiosResponse<Response> = await request({
      data,
      method,
      params,
      url,
    })

    return response.data
  } catch (e) {
    const { message } = e.response?.data || {}
    const errorMessage = message ?? `An unexpected error occurred`
    const error = new Error(errorMessage, { cause: e })

    throw error
  }
}
