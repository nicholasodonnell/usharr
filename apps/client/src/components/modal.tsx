import cx from 'classnames'
import React from 'react'

export type ModalProps = {
  children?: React.ReactNode
  onClose: () => void
  open: boolean
}

export default function Modal({
  children,
  onClose,
  open,
}: ModalProps): JSX.Element {
  return (
    <div
      className={cx({
        'pointer-events-none opacity-0': !open,
      })}>
      <div
        className={cx(
          'fixed inset-0 z-30 bg-black opacity-50 transition-all duration-200',
          {
            'opacity-0': !open,
          },
        )}
        onClick={onClose}
      />
      <div
        className={cx(
          'md:hide-scrollbar fixed left-0 top-24 z-40 m-auto h-5/6 w-full overflow-scroll border-[1px] border-app-background-accent bg-app-background-light p-4 shadow-xl transition-all duration-200 md:inset-0 md:h-[fit-content] md:max-h-screen md:max-w-3xl md:overflow-auto md:rounded-md md:p-6',
          {
            'opacity-0 md:scale-50': !open,
          },
        )}>
        {children}
      </div>
    </div>
  )
}
