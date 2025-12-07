import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

type Props = { children: React.ReactNode }

export default function Layout({ children }: Props) {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex">
      <Sidebar open={open} onClose={() => setOpen(false)} collapsed={collapsed} onToggleCollapse={() => setCollapsed(v => !v)} />
      <div className={`flex-1 ${collapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <Header onMenuClick={() => setOpen(true)} />
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  )
}
