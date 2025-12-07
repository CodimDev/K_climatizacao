import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Link } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  Settings,
  UserCircle,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react'

type Props = { onMenuClick: () => void }

export default function Header({ onMenuClick }: Props) {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-7xl h-full px-3 flex items-center gap-3">
        <div className="lg:hidden">
          <Button variant="ghost" size="sm" onClick={onMenuClick}>
            <Menu className="w-4 h-4" />
          </Button>
        </div>
        <div className="hidden md:flex items-center gap-2 flex-1">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-white dark:bg-muted border-border shadow-sm"
              placeholder="Buscar"
            />
          </div>
          <kbd className="hidden lg:flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
            ⌘K
          </kbd>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/notifications"
            className="relative rounded-md p-2 hover:bg-muted"
          >
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute right-1 top-1 w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </Link>
          <button onClick={toggle} className="rounded-md p-2 hover:bg-muted">
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Moon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
          <Link to="/settings" className="rounded-md p-2 hover:bg-muted">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </Link>
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-full border border-border bg-muted w-8 h-8 flex items-center justify-center"
            >
              <UserCircle className="w-4 h-4 text-muted-foreground" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-background shadow-lg">
                <div className="px-3 py-2">
                  <div className="text-sm font-medium">Operador</div>
                  <div className="text-xs text-muted-foreground">
                    op@empresa.com
                  </div>
                </div>
                <div className="border-t border-border">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                  >
                    <UserCircle className="w-4 h-4" />
                    Meu Perfil
                  </Link>
                  <button className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
