import { ButtonHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const base = 'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed'
const variants = {
  primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 focus:ring-gray-400',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800',
  destructive: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600',
}
const sizes = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-3 py-2',
  lg: 'text-base px-4 py-2.5',
}

export default function Button({ variant = 'primary', size = 'md', loading, className, children, ...rest }: Props) {
  return (
    <button className={twMerge(base, variants[variant], sizes[size], className)} {...rest}>
      {loading ? '...' : children}
    </button>
  )
}
