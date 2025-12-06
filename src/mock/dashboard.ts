import { KPI, ServiceOrder } from '../types'

export const kpis: KPI[] = [
  { label: 'Ordens hoje', value: 8, delta: 12, trend: 'up' },
  { label: 'Receita (R$)', value: 15800, delta: 5, trend: 'up' },
  { label: 'Pendentes', value: 17, delta: -8, trend: 'down' },
  { label: 'Alertas estoque', value: 3, delta: 0, trend: 'flat' },
]

export const financeSeries = [
  { date: 'Seg', income: 1200, expense: 500 },
  { date: 'Ter', income: 1800, expense: 800 },
  { date: 'Qua', income: 900, expense: 300 },
  { date: 'Qui', income: 2200, expense: 1200 },
  { date: 'Sex', income: 1500, expense: 700 },
]

export const todayOrders: ServiceOrder[] = [
  { id: 'SO-101', clientId: 'C-01', title: 'Instalação Split 12k', status: 'in_progress', priority: 'high', scheduledAt: new Date().toISOString() },
  { id: 'SO-102', clientId: 'C-02', title: 'Manutenção preventiva', status: 'open', priority: 'medium', scheduledAt: new Date().toISOString() },
  { id: 'SO-103', clientId: 'C-03', title: 'Troca de compressor', status: 'open', priority: 'urgent', scheduledAt: new Date().toISOString() },
]

export const priorityOrders: ServiceOrder[] = [
  { id: 'SO-103', clientId: 'C-03', title: 'Troca de compressor', status: 'open', priority: 'urgent' },
  { id: 'SO-110', clientId: 'C-07', title: 'Vazamento de gás', status: 'open', priority: 'high' },
]

export const weekDays = [
  { day: 'Seg', scheduled: 3 },
  { day: 'Ter', scheduled: 4 },
  { day: 'Qua', scheduled: 2 },
  { day: 'Qui', scheduled: 5 },
  { day: 'Sex', scheduled: 4 },
  { day: 'Sáb', scheduled: 1 },
  { day: 'Dom', scheduled: 0 },
]
