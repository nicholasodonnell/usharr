import axios from 'axios'
import type { AxiosInstance, AxiosResponse, Method } from 'axios'
import { toast } from 'react-toastify'

export type Request<Data> = {
  data?: Data
  method?: Method
  params?: Record<string, unknown>
  url: string
}

const client: AxiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? '/'
      : `http://${window.location.hostname}:3001`,
})

export default async function request<Data, Response = Data>({
  data,
  method = 'GET',
  params = {},
  url,
}: Request<Data>): Promise<Response> {
  try {
    const response: AxiosResponse<Response> = await client({
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

    toast.error(errorMessage)

    throw error
  }
}
