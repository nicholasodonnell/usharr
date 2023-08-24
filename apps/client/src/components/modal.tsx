import cx from 'classnames'
import React, { useEffect, useState } from 'react'

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
  const [isOpen, setIsOpen] = useState<boolean>(open)

  useEffect(() => {
    setIsOpen(open)
  }, [open])

  return open ? (
    <div className="fixed z-40" role="dialog">
      <div
        className={cx('fixed inset-0 bg-black transition-all duration-200', {
          'opacity-50': isOpen,
          'pointer-events-none opacity-0': !isOpen,
        })}
        onClick={onClose}
      />
      <div
        className={cx(
          'fixed left-0 top-24 m-auto h-5/6 w-full overflow-scroll rounded-md border-[1px] border-app-background-accent bg-app-background-light p-4 shadow-xl transition-all duration-200',
          'md:hide-scrollbar md:inset-0 md:h-[fit-content] md:max-h-screen md:max-w-3xl md:overflow-auto md:p-6',
          {
            'opacity-100 md:scale-100': isOpen,
            'pointer-events-none opacity-0 md:scale-50': !isOpen,
          },
        )}>
        {children}
      </div>
    </div>
  ) : null
}
