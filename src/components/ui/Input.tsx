import { InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
  helper?: string
}

export default function Input({ label, error, helper, className, id, ...rest }: Props) {
  const inputId = id || `input-${Math.random().toString(36).slice(2)}`
  return (
    <div className="space-y-1">
      {label && <label htmlFor={inputId} className="text-sm text-gray-700 dark:text-gray-300">{label}</label>}
      <input id={inputId} className={twMerge('w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary', error && 'border-rose-500', className)} {...rest} />
      {helper && !error && <p className="text-xs text-gray-500 dark:text-gray-400">{helper}</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  )
}
