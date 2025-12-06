export type Status = 'open' | 'in_progress' | 'done' | 'cancelled'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'
export type AppointmentStatus = 'pending' | 'confirmed' | 'done' | 'cancelled'

export type Client = {
  id: string
  name: string
  phone?: string
  email?: string
  address?: string
  status?: Status
}

export type ServiceOrder = {
  id: string
  clientId: string
  title: string
  description?: string
  status: Status
  priority: Priority
  scheduledAt?: string
  assignedTo?: string
  equipmentId?: string
  startedAt?: string
  completedAt?: string
}

export type FinancialTransaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
  category?: string
  referenceId?: string
  method?: 'cash' | 'card' | 'pix' | 'transfer'
}

export type StockItem = {
  id: string
  name: string
  sku?: string
  quantity: number
  minQuantity?: number
  location?: string
}

export type StockMovement = {
  id: string
  itemId: string
  type: 'in' | 'out' | 'adjust'
  quantity: number
  reason?: string
  serviceOrderId?: string
  date: string
}

export type KPI = {
  label: string
  value: number
  delta?: number
  trend?: 'up' | 'down' | 'flat'
}

export type User = {
  id: string
  name: string
  role: string
  email: string
  avatarUrl?: string
  active: boolean
}

export type Appointment = {
  id: string
  clientId: string
  serviceId: string
  date: string
  time: string
  status: AppointmentStatus
  notes?: string
}

export type Equipment = {
  id: string
  type: string
  brand: string
  model: string
  capacity?: string
  serialNumber?: string
  clientId: string
  installedAt?: string
}

export type Service = {
  id: string
  name: string
  description?: string
  price: number
  durationMinutes: number
  category?: string
  active: boolean
}

export type Notification = {
  id: string
  title: string
  description: string
  type: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  date: string
}

export type Settings = {
  companyName: string
  phone?: string
  email?: string
  address?: string
  messageTemplates?: Record<string, string>
}

export type Permission = 'view' | 'edit' | 'delete' | 'admin'

export type UserPermissionsMatrix = {
  userId: string
  module: string
  permissions: Permission[]
}

export type ScheduleConfig = {
  workDays: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'>
  startHour: string
  endHour: string
  intervalMinutes: number
  maxPerDay: number
}
