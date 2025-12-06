import { ReactNode } from 'react'
import Button from './Button'

type Props = {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
}

export default function Modal({ open, onClose, title, children, footer }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        {title && <div className="mb-3 text-lg font-semibold">{title}</div>}
        <div className="mb-4">{children}</div>
        <div className="flex justify-end gap-2">
          {footer ?? <Button variant="secondary" onClick={onClose}>Fechar</Button>}
        </div>
      </div>
    </div>
  )
}
