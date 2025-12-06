import { useState } from 'react'
import Sidebar from './Sidebar'
import Button from '../ui/Button'
import { Menu } from 'lucide-react'

type Props = { children: React.ReactNode }

export default function Layout({ children }: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 lg:ml-64">
        <div className="border-b border-gray-200 dark:border-gray-800 p-3 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
            <Menu className="w-4 h-4" />
          </Button>
          <div className="text-sm text-gray-500 dark:text-gray-400">Navegação</div>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
