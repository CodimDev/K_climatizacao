import { LayoutDashboard, Calendar, ClipboardList, Users, Wrench, DollarSign, Package, Clock, Settings, Bell } from 'lucide-react'

export const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, page: 'Dashboard' },
  { name: 'Ordens de Serviço', icon: ClipboardList, page: 'ServiceOrders' },
  { name: 'Agendamentos', icon: Calendar, page: 'Appointments' },
  { name: 'Clientes', icon: Users, page: 'Clients' },
  { name: 'Equipamentos', icon: Package, page: 'Equipments' },
  { name: 'Serviços', icon: Wrench, page: 'Services' },
  { name: 'Financeiro', icon: DollarSign, page: 'Financial' },
  { name: 'Estoque', icon: Package, page: 'Stock' },
]

export const secondaryMenuItems = [
  { name: 'Histórico', icon: Clock, page: 'MaintenanceHistory' },
  { name: 'Usuários', icon: Users, page: 'Users' },
  { name: 'Configurações', icon: Settings, page: 'Settings' },
  { name: 'Notificações', icon: Bell, page: 'Notifications' },
  { name: 'Documentação', icon: LayoutDashboard, page: 'DocView' },
]
