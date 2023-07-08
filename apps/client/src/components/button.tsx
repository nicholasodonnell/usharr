import cx from 'classnames'
import React from 'react'

export type ButtonProps = {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  primary?: boolean
  secondary?: boolean
  type?: 'button' | 'submit'
  warning?: boolean
}

export default function Button({
  children,
  className,
  disabled = false,
  onClick,
  primary = true,
  secondary = false,
  type = 'button',
  warning = false,
}: ButtonProps): JSX.Element {
  const handleClick = () => {
    onClick?.()
  }

  return (
    <button
      className={cx(
        'border-app-background-accent rounded border px-4 py-2 font-bold text-white transition-colors',
        {
          'bg-purple hover:bg-purple-secondary':
            primary && !secondary && !warning,
          'bg-app-background hover:bg-app-background-light': secondary,
          'bg-pink hover:bg-pink-secondary': warning,
          'pointer-events-none opacity-50': disabled,
        },
        className,
      )}
      disabled={disabled}
      type={type}
      onClick={handleClick}>
      {children}
    </button>
  )
}
