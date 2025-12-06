import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
  title?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export default function Card({ title, actions, children, className }: Props) {
  return (
    <div className={twMerge('rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4', className)}>
      {(title || actions) && (
        <div className="mb-3 flex items-center justify-between">
          <div className="font-medium">{title}</div>
          <div>{actions}</div>
        </div>
      )}
      {children}
    </div>
  )
}
