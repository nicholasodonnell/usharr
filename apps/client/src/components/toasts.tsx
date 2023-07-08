import cx from 'classnames'
import React, { useEffect, useState } from 'react'

import type { Toast as ToastModel } from '../hooks/useToast'

import { Information, Warning } from './icon'

export type ToastProps = {
  toasts: ToastModel[]
}

export function Toast({ message, type = 'info' }: ToastModel): JSX.Element {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timeoutIn = setTimeout(() => {
      setVisible(true)
    }, 100)

    const timeoutOut = setTimeout(() => {
      setVisible(false)
    }, 5000)

    return () => {
      clearTimeout(timeoutIn)
      clearTimeout(timeoutOut)
    }
  }, [])

  return (
    <div
      className={cx(
        'pointer-events-none ml-auto mt-4 flex w-[fit-content] max-w-lg items-center justify-center rounded-lg px-6 py-4 pl-4 shadow-lg transition-all',
        {
          'bg-red text-white': type === 'error',
          'bg-purple text-white': type === 'info',
          'opacity-100 translate-x-0': visible,
          'opacity-0 translate-x-full': !visible,
        },
      )}>
      {type === 'info' && <Information className="mr-3 h-8 w-8" />}
      {type === 'error' && <Warning className="mr-3 h-8 w-8" />}
      <div className="ml-auto flex flex-1">{message}</div>
    </div>
  )
}

export default function Toasts({ toasts }: ToastProps): JSX.Element {
  return (
    <div className="pointer-events-none fixed bottom-2 right-2 z-50 p-4 font-mono md:bottom-4 md:right-4">
      {toasts.map((toast: ToastModel) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
