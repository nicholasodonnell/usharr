import cx from 'classnames'
import React from 'react'

export type AProps = TextProps & {
  href: string
}

export type TextProps = Variants & {
  children: React.ReactNode
  className?: string
}

export type Variants = {
  bold?: boolean
  italic?: boolean
  underline?: boolean
}

const getVariants = ({ bold, italic, underline }: Variants) => ({
  'font-bold': bold,
  italic: italic,
  'underline decoration-dotted underline-offset-4': underline,
})

export function A({
  children,
  className,
  href,
  ...variants
}: AProps): React.ReactNode {
  return (
    <a
      className={cx(getVariants({ ...variants, underline: true }), className)}
      href={href}
      rel="noopener noreferrer"
      target="_blank">
      {children}
    </a>
  )
}

export function H1({
  children,
  className,
  ...variants
}: TextProps): React.ReactNode {
  return (
    <h1 className={cx('text-5xl', getVariants(variants), className)}>
      {children}
    </h1>
  )
}

export function H2({
  children,
  className,
  ...variants
}: TextProps): React.ReactNode {
  return (
    <h2 className={cx('text-4xl', getVariants(variants), className)}>
      {children}
    </h2>
  )
}

export function H3({
  children,
  className,
  ...variants
}: TextProps): React.ReactNode {
  return (
    <h3 className={cx('text-3xl', getVariants(variants), className)}>
      {children}
    </h3>
  )
}

export function H4({
  children,
  className,
  ...variants
}: TextProps): React.ReactNode {
  return (
    <h3 className={cx('text-2xl', getVariants(variants), className)}>
      {children}
    </h3>
  )
}

export function P({
  children,
  className,
  ...variants
}: TextProps): React.ReactNode {
  return (
    <p className={cx('text-lg', getVariants(variants), className)}>
      {children}
    </p>
  )
}
