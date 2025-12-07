import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import auth from '@/api/auth'
import { ThemeProvider } from '@/components/dashboard/ThemeProvider'
import { menuItems, secondaryMenuItems } from '@/config/menu'
import { LogOut, Menu, X, Bell, Search, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export default function Layout({
  children,
  currentPageName,
}: {
  children: React.ReactNode
  currentPageName?: string
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [permissions, setPermissions] = useState<any>(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const userData = await auth.me()
      setUser(userData)
      setPermissions(userData.permissions || {})
    } catch (e) {}
  }

  const checkPermission = (page: string) => {
    if (!permissions) return true // Loading or no permissions system
    if (user?.role === 'admin') return true // Admin bypass

    const mapping: Record<string, string> = {
      Dashboard: 'dashboard',
      ServiceOrders: 'service_orders',
      Appointments: 'appointments',
      Clients: 'clients',
      Equipments: 'equipments',
      Services: 'services',
      Financial: 'financial',
      Stock: 'stock',
      MaintenanceHistory: 'service_orders', // Part of OS
      Users: 'users',
      Settings: 'settings',
      Notifications: 'dashboard', // Everyone sees
      DocView: 'dashboard', // Everyone sees
    }

    const key = mapping[page]
    if (!key) return true

    // Check 'view' permission
    return permissions[key]?.view === true
  }

  const handleLogout = () => {
    auth.logout()
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`
                fixed top-0 left-0 z-50 h-full w-64
                bg-background border-r border-border
                transform transition-transform duration-300 ease-out
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              `}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between h-16 px-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-400 flex items-center justify-center glow-cyan">
                  <span className="text-black font-bold text-lg">K</span>
                </div>
                <div>
                  <h1 className="font-semibold text-foreground text-sm tracking-tight">
                    K-Climatização
                  </h1>
                  <p className="text-[10px] text-muted-foreground">
                    Sistema de Gestão
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex-1 py-4 px-3 overflow-y-auto">
              <div className="space-y-1">
                {menuItems.map((item) => {
                  if (!checkPermission(item.page)) return null
                  const isActive = currentPageName === item.page
                  return (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                                                        flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
                                                        transition-all duration-200 group relative
                                                        ${
                                                          isActive
                                                            ? 'nav-item-active text-primary'
                                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                                        }
                                                      `}
                    >
                      <item.icon
                        className={`h-[18px] w-[18px] transition-colors ${
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-foreground'
                        }`}
                      />
                      {item.name}
                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
                      )}
                    </Link>
                  )
                })}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="px-3 mb-2 text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider">
                  Sistema
                </p>
                <div className="space-y-1">
                  {secondaryMenuItems.map((item) => {
                    if (!checkPermission(item.page)) return null
                    const isActive = currentPageName === item.page
                    return (
                      <Link
                        key={item.page}
                        to={createPageUrl(item.page)}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                                                            flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] font-medium
                                                            transition-all duration-200 group relative
                                                            ${
                                                              isActive
                                                                ? 'nav-item-active text-primary'
                                                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                                            }
                                                          `}
                      >
                        <item.icon
                          className={`h-4 w-4 transition-colors ${
                            isActive
                              ? 'text-primary'
                              : 'text-muted-foreground group-hover:text-foreground'
                          }`}
                        />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </nav>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                <Avatar className="h-8 w-8 bg-gradient-to-br from-cyan-500/20 to-cyan-400/20 border border-cyan-500/30">
                  <AvatarFallback className="bg-transparent text-cyan-400 text-xs font-medium">
                    {user?.full_name?.[0] || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    {user?.full_name || 'Administrador'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Admin</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Sair do sistema
              </button>
            </div>
          </div>
        </aside>

        <div className="lg:ml-64">
          <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div className="hidden md:flex items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar..."
                      className="w-64 pl-9 h-9 bg-muted/50 border-border text-foreground placeholder:text-muted-foreground text-sm focus:border-primary/50 focus:ring-primary/20"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link to={createPageUrl('Notifications')}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full pulse-dot" />
                  </Button>
                </Link>

                <Link to={createPageUrl('Settings')}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Settings className="h-[18px] w-[18px]" />
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted transition-colors ml-2">
                      <Avatar className="h-8 w-8 bg-gradient-to-br from-cyan-500/20 to-cyan-400/20 border border-cyan-500/30">
                        <AvatarFallback className="bg-transparent text-cyan-400 text-xs font-medium">
                          {user?.full_name?.[0] || 'A'}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-popover border-border text-popover-foreground"
                  >
                    <div className="p-2 border-b border-border">
                      <p className="text-sm font-medium">
                        {user?.full_name || 'Administrador'}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {user?.email || 'admin@kclimatizacao.com'}
                      </p>
                    </div>
                    <Link to={createPageUrl('Profile')} className="w-full">
                      <DropdownMenuItem className="text-muted-foreground hover:text-foreground cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Meu Perfil
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator className="bg-border" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="p-4 lg:p-6 fade-in">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  )
}
