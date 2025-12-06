import { SelectHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  error?: string
}

export default function Select({ label, error, className, id, children, ...rest }: Props) {
  const selectId = id || `select-${Math.random().toString(36).slice(2)}`
  return (
    <div className="space-y-1">
      {label && <label htmlFor={selectId} className="text-sm text-gray-700 dark:text-gray-300">{label}</label>}
      <select id={selectId} className={twMerge('w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary', error && 'border-rose-500', className)} {...rest}>
        {children}
      </select>
      {error && <p className="text-xs text-rose-600">{error}</p>}
    </div>
  )
}
