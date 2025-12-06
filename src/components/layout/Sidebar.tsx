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
      <aside className={`fixed left-0 top-0 h-screen w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 z-40`}> 
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
          <UserCircle className="w-6 h-6" />
          <div className="font-semibold">K Climatização</div>
        </div>
        <nav className="p-2 space-y-6 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="space-y-1">
            {menuItems.map(it => {
              const Icon = it.icon
              const active = pathname === it.to
              return (
                <Link key={it.to} to={it.to} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-200' : 'hover:bg-gray-100 dark:hover:bg-gray-900'}`}> 
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{it.label}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />}
                </Link>
              )
            })}
          </div>
          <div className="space-y-1">
            {secondaryMenuItems.map(it => {
              const Icon = it.icon
              const active = pathname === it.to
              return (
                <Link key={it.to} to={it.to} className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${active ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200' : 'hover:bg-gray-100 dark:hover:bg-gray-900'}`}> 
                  <Icon className="w-4 h-4" />
                  <span className="flex-1">{it.label}</span>
                  {active && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                </Link>
              )
            })}
          </div>
          <div className="mt-6 p-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <UserCircle className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <div className="font-medium">Operador</div>
                <button className="text-xs text-red-600 dark:text-red-400">Sair</button>
              </div>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}
