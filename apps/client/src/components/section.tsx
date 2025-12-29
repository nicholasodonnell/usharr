import cx from 'classnames'
import React from 'react'

import { H3, P } from './text'

export type DescriptionProps = {
  children: React.ReactNode
  className?: string
}

export type SectionProps = {
  children: React.ReactNode
  className?: string
}

export type TitleProps = {
  children: React.ReactNode
  className?: string
}

export function Description({
  children,
  className,
}: DescriptionProps): React.ReactNode {
  return (
    <P className={cx('mb-5 text-gray', className)} italic>
      {children}
    </P>
  )
}

export function Section({
  children,
  className,
}: SectionProps): React.ReactNode {
  return (
    <section className={cx('flex flex-col', className)}>{children}</section>
  )
}

export function Title({ children, className }: TitleProps): React.ReactNode {
  return (
    <H3
      className={cx(
        'mb-5 truncate border-b border-app-background-accent pb-4',
        className,
      )}>
      {children}
    </H3>
  )
}

export default Section
