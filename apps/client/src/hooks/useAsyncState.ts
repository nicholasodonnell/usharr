import { useEffect, useState } from 'react'

export type UseAsyncState<T> = [state: T, setState: (state: T) => void]

export default function useAsyncState<T>(apiState: T): UseAsyncState<T> {
  const [state, setState] = useState<T>(apiState)

  useEffect(() => {
    setState(apiState)
  }, [apiState])

  return [state, setState]
}
