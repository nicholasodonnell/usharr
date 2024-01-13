import cx from 'classnames'
import React from 'react'

import { P } from './text'

export type AlertProps = {
  children: React.ReactNode
  className?: string
  error?: boolean
  warning?: boolean
}

export default function Alert({
  children,
  className,
  error = false,
  warning = false,
}: AlertProps): JSX.Element {
  return (
    <div
      className={cx(
        'flex w-full flex-row rounded px-4 py-2',
        {
          'bg-orange text-black': warning,
          'bg-red text-white': error || (!error && !warning),
        },
        className,
      )}>
      <P className="mr-2">{children}</P>
    </div>
  )
}
