import cx from 'classnames'
import React from 'react'

import { H3, P } from './text'

export type TitleProps = {
  children: React.ReactNode
  className?: string
}

export type DescriptionProps = {
  children: React.ReactNode
  className?: string
}

export type SectionProps = {
  children: React.ReactNode
  className?: string
}

export function Title({ children, className }: TitleProps): JSX.Element {
  return (
    <H3
      className={cx(
        'border-app-background-accent mb-5 truncate border-b pb-4',
        className,
      )}>
      {children}
    </H3>
  )
}

export function Description({
  children,
  className,
}: DescriptionProps): JSX.Element {
  return (
    <P className={cx('text-gray mb-5', className)} italic>
      {children}
    </P>
  )
}

export function Section({ children, className }: SectionProps): JSX.Element {
  return (
    <section className={cx('flex flex-col', className)}>{children}</section>
  )
}

export default Section
