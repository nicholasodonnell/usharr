import React from 'react'

export type MainProps = {
  children?: React.ReactNode
}

export default function Main({ children }: MainProps): JSX.Element {
  return (
    <main className="z-10 flex flex-1 pt-20 md:pl-64 md:pt-0">
      <div className="flex w-full flex-1 flex-col overflow-y-auto px-4 py-6 md:px-8 md:py-12">
        {children}
      </div>
    </main>
  )
}
