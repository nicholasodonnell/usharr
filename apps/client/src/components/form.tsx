import cx from 'classnames'
import React from 'react'

export type FormProps = {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onSubmit?: () => Promise<void>
}

export type FieldProps = {
  children: React.ReactNode
  className?: string
}

export type ActionsProps = {
  children: React.ReactNode
  className?: string
}

export type GenericInputProps = {
  className?: string
  disabled?: boolean
  maxLength?: number
  placeholder?: string
  required?: boolean
}

export type InputProps = GenericInputProps & {
  onChange: (value: string) => void
  type?: 'text' | 'password'
  value: string | null
}

export type NumberInputProps = GenericInputProps & {
  max?: number
  min?: number
  onChange: (value: number) => void
  value: number | null
}

export type LabelPros = {
  className?: string
  children: React.ReactNode
  required?: boolean
}

export type SelectOption<T> = {
  label: string
  value: T
}

export type GenericSelectProps<T> = {
  className?: string
  disabled?: boolean
  options: SelectOption<T>[]
  required?: boolean
}

export type SelectProps<T> = GenericSelectProps<T> & {
  onChange: (value: T) => void
  value: T
}

export type MultipleSelectProps<T> = GenericSelectProps<T> & {
  onChange: (values: T[]) => void
  values: T[]
}

export type CheckboxProps = {
  className: string
  disabled?: boolean
  onChange: (value: boolean) => void
  required?: boolean
  value: boolean
}

export function Form({
  children,
  className,
  disabled = false,
  onSubmit,
}: FormProps): JSX.Element {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    onSubmit?.()
  }

  return (
    <form
      autoComplete="off"
      className={cx(
        'grid flex-1 grid-cols-1 gap-8 md:gap-6',
        {
          'pointer-events-none opacity-50': disabled,
        },
        className,
      )}
      onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

export function Field({ children, className }: FieldProps): JSX.Element {
  return (
    <div
      className={cx('grid w-full grid-cols-4 gap-2 align-middle', className)}>
      {children}
    </div>
  )
}

export function Actions({ children, className }: ActionsProps): JSX.Element {
  return (
    <div className={cx('mt-5 flex w-full justify-end gap-4', className)}>
      {children}
    </div>
  )
}

export function Label({
  className,
  children,
  required = false,
}: LabelPros): JSX.Element {
  return (
    <label className={cx('text-md flex items-center', className)}>
      <span>
        {children}
        {required && <sup className="ml-1 text-red ">*</sup>}
      </span>
    </label>
  )
}

export function Input({
  className,
  disabled = false,
  maxLength,
  onChange,
  placeholder = '',
  required = false,
  type = 'text',
  value,
}: InputProps): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value || null)
  }

  return (
    <input
      autoComplete="off"
      className={cx(
        'w-full rounded-md border border-app-background-accent bg-app-background px-4 py-2 text-xl transition-colors focus:border-pink focus:outline-none ',
        {
          'pointer-events-none opacity-50': disabled,
        },
        className,
      )}
      maxLength={maxLength}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value || ''}
    />
  )
}

export function NumberInput({
  className,
  disabled = false,
  max,
  maxLength,
  min = 0,
  onChange,
  placeholder = '',
  required = false,
  value,
}: NumberInputProps): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(parseInt(event.target.value))
  }

  return (
    <input
      autoComplete="off"
      className={cx(
        'h-12 w-full rounded-md border border-app-background-accent bg-app-background px-4 py-2 text-xl transition-colors focus:border-pink focus:outline-none ',
        {
          'pointer-events-none opacity-50': disabled,
        },
        className,
      )}
      max={max}
      maxLength={maxLength}
      min={min}
      onChange={handleChange}
      pattern="\d*"
      placeholder={placeholder}
      required={required}
      type="number"
      value={value || ''}
    />
  )
}

export function Select<T>({
  className,
  disabled = false,
  onChange,
  options = [],
  required = false,
  value,
}: SelectProps<T>): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(options[event.target.selectedOptions[0].index].value)
  }

  return (
    <select
      autoComplete="off"
      className={cx(
        'h-12 w-full rounded-md border border-app-background-accent bg-app-background px-4 py-2 text-xl transition-colors focus:border-pink focus:outline-none ',
        {
          'pointer-events-none opacity-50': disabled,
        },
        className,
      )}
      disabled={disabled}
      onChange={handleChange}
      required={required}>
      {options.map((option: SelectOption<T>) => (
        <option
          disabled={disabled}
          key={option.label}
          selected={option.value === value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function MultipleSelect<T>({
  className,
  disabled = false,
  onChange,
  options = [],
  required = false,
  values = [],
}: MultipleSelectProps<T>): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(
      Array.from(event.target.selectedOptions).map(
        (option: HTMLOptionElement) => options[option.index].value,
      ),
    )
  }

  return (
    <select
      autoComplete="off"
      className={cx(
        'h-52 w-full rounded-md border border-app-background-accent bg-app-background px-4 py-2 text-xl transition-colors focus:border-pink focus:outline-none ',
        {
          'pointer-events-none opacity-50': disabled,
        },
        className,
      )}
      disabled={disabled}
      multiple
      onChange={handleChange}
      required={required}>
      {options.map((option: SelectOption<T>) => (
        <option
          disabled={disabled}
          key={option.label}
          selected={values
            ?.map((val) => JSON.stringify(val))
            ?.includes(JSON.stringify(option.value))}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export function Checkbox({
  className,
  disabled = false,
  onChange,
  value = false,
  required = false,
}: CheckboxProps): JSX.Element {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.checked)
  }

  return (
    <input
      autoComplete="off"
      checked={value}
      className={cx(
        'h-6 w-6 rounded-md border border-app-background-accent accent-pink transition-colors focus:border-pink focus:outline-none',
        {
          'pointer-events-none opacity-50': disabled,
        },
        className,
      )}
      disabled={disabled}
      onChange={handleChange}
      required={required}
      type="checkbox"
    />
  )
}
