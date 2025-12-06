import { useLocation, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { Home, CalendarDays, ClipboardList, Users, Wrench, Package, ClipboardCheck, DollarSign, Bell, Settings, Shield, UserCircle } from 'lucide-react'

type Props = { open: boolean; onClose: () => void }

const menuItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/service-orders', label: 'Ordens', icon: ClipboardList },
  { to: '/appointments', label: 'Agendamentos', icon: CalendarDays },
  { to: '/clients', label: 'Clientes', icon: Users },
  { to: '/equipments', label: 'Equipamentos', icon: Wrench },
  { to: '/services', label: 'Serviços', icon: ClipboardCheck },
  { to: '/financial', label: 'Financeiro', icon: DollarSign },
  { to: '/stock', label: 'Estoque', icon: Package },
]

const secondaryMenuItems = [
  { to: '/maintenance-history', label: 'Manutenções', icon: Wrench },
  { to: '/notifications', label: 'Notificações', icon: Bell },
  { to: '/users', label: 'Usuários', icon: Users },
  { to: '/permissions', label: 'Permissões', icon: Shield },
  { to: '/settings', label: 'Configurações', icon: Settings },
]

export default function Sidebar({ open, onClose }: Props) {
  const { pathname } = useLocation()
  useEffect(() => {
    const body = document.body
    if (open) body.classList.add('overflow-hidden')
    else body.classList.remove('overflow-hidden')
    return () => body.classList.remove('overflow-hidden')
  }, [open])
  return (
    <>
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} lg:hidden`} onClick={onClose} />
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 transform transition-transform duration-300 ease-out bg-background border-r border-border ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}> 
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-cyan-500 to-cyan-400 shadow-md" />
            <div className="font-semibold">K-Climatização</div>
          </div>
        </div>
        <nav className="p-2 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="space-y-1">
            {menuItems.map(it => {
              const Icon = it.icon
              const active = pathname === it.to
              return (
                <Link key={it.to} to={it.to} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted ${active ? 'text-primary bg-muted border-l-2 border-l-primary' : ''}`}> 
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{it.label}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                </Link>
              )
            })}
          </div>
          <div className="space-y-1">
            {secondaryMenuItems.map(it => {
              const Icon = it.icon
              const active = pathname === it.to
              return (
                <Link key={it.to} to={it.to} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted ${active ? 'text-primary bg-muted border-l-2 border-l-primary' : ''}`}> 
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{it.label}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                </Link>
              )
            })}
          </div>
          <div className="mt-6 p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-border bg-gradient-to-br from-cyan-500/20 to-cyan-400/20 flex items-center justify-center">
                <span className="text-xs font-semibold text-cyan-600">OP</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">Operador</div>
                <div className="text-xs text-muted-foreground">op@empresa.com</div>
              </div>
              <button className="ml-auto text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md px-2 py-1 flex items-center gap-1">
                <UserCircle className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
