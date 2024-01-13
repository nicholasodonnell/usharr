import { useCallback, useEffect, useState } from 'react'

import api from '../lib/api'

import { useToast } from './useToast'

export type UseFetch<Response> = {
  data: Response
  fetch: () => Promise<Response>
  loading: boolean
}

export type UseCreate<Data, Response> = {
  create: (data?: Data) => Promise<Response>
  data: Response
  loading: boolean
}

export type UseMutate<Data, Response> = {
  data: Response
  loading: boolean
  mutate: (id: number, data?: Data) => Promise<Response>
}

export type UseDestroy = {
  destroy: (id: number) => Promise<void>
  loading: boolean
}

export function useFetch<Response>(url: string): UseFetch<Response> {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Response>(undefined)
  const { addToast } = useToast()

  const fetch = useCallback(async () => {
    setLoading(true)

    try {
      const data = await api<Response>({ url })
      setData(data)

      return data
    } catch (e) {
      addToast({ message: e.message, type: 'error' })
      throw e
    } finally {
      setLoading(false)
    }
  }, [url, addToast])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, fetch, loading }
}

export function useCreate<Data, Response = Data>(
  url: string,
): UseCreate<Data, Response> {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Response>(undefined)
  const { addToast } = useToast()

  const create = useCallback(
    async (postData?: Data) => {
      setLoading(true)

      try {
        const data = await api<Data, Response>({
          data: postData,
          method: 'POST',
          url: url,
        })

        setData(data)

        return data
      } catch (e) {
        addToast({ message: e.message, type: 'error' })
        throw e
      } finally {
        setLoading(false)
      }
    },
    [addToast, url],
  )

  return { create, data, loading }
}

export function useMutate<Data, Response = Data>(
  url: string,
): UseMutate<Data, Response> {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Response>(undefined)
  const { addToast } = useToast()

  const mutate = useCallback(
    async (id: number, putData?: Data) => {
      setLoading(true)

      try {
        const data = await api<Data, Response>({
          data: putData,
          method: 'PUT',
          url: url.replace(':id', id.toString()),
        })

        setData(data)

        return data
      } catch (e) {
        addToast({ message: e.message, type: 'error' })
        throw e
      } finally {
        setLoading(false)
      }
    },
    [addToast, url],
  )

  return { data, loading, mutate }
}

export function useDestroy(url: string): UseDestroy {
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const destroy = useCallback(
    async (id: number) => {
      setLoading(true)

      try {
        await api({
          method: 'DELETE',
          url: url.replace(':id', id.toString()),
        })
      } catch (e) {
        addToast({ message: e.message, type: 'error' })
        throw e
      } finally {
        setLoading(false)
      }
    },
    [addToast, url],
  )

  return { destroy, loading }
}
