export type Status = 'open' | 'in_progress' | 'done' | 'cancelled'
export type Priority = 'low' | 'medium' | 'high' | 'urgent'

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
}

export type FinancialTransaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
  category?: string
  referenceId?: string
}

export type StockItem = {
  id: string
  name: string
  sku?: string
  quantity: number
  minQuantity?: number
  location?: string
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
