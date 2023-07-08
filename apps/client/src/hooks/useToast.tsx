import React, { createContext, useCallback, useContext, useState } from 'react'

export const ToastContext = createContext(undefined)

export type Toast = {
  id?: number
  message: string
  type?: 'error' | 'info'
}

export type ToastProviderProps = {
  children: React.ReactNode
}

export type ToastProvider = {
  toasts: Toast[]
  addToast: (toast: Toast) => void
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const handleAddToast = useCallback((toast: Toast) => {
    toast.id = new Date().getTime()
    setToasts((toasts) => [...toasts, toast])
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast: handleAddToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastProvider => useContext(ToastContext)
