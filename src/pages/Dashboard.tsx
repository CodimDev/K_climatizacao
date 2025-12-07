import React from 'react'
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns'
import {
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  Wallet,
  Package,
  CheckCircle,
} from 'lucide-react'

import KPICard from '@/components/ui/KPICard'

export default function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const weekEnd = format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')
  const lastMonthStart = format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd')
  const lastMonthEnd = format(endOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd')

  const serviceOrders: any[] = []
  const financials: any[] = []
  const stocks: any[] = []
  const clients: any[] = []

  const todayOrders = serviceOrders.filter((so) => so.scheduled_date === today)
  const weekOrders = serviceOrders.filter(
    (so) => so.scheduled_date >= weekStart && so.scheduled_date <= weekEnd
  )
  const delayedOrders = serviceOrders.filter(
    (so) => so.status !== 'concluido' && so.status !== 'cancelado' && so.scheduled_date < today
  )
  const criticalOrders = serviceOrders.filter(
    (so) => so.priority === 'urgente' && so.status !== 'concluido'
  )
  const completedMonth = serviceOrders.filter(
    (so) => so.scheduled_date >= monthStart && so.scheduled_date <= monthEnd && so.status === 'concluido'
  )

  const monthFinancials = financials.filter((f) => f.date >= monthStart && f.date <= monthEnd)
  const lastMonthFinancials = financials.filter((f) => f.date >= lastMonthStart && f.date <= lastMonthEnd)

  const monthRevenue = monthFinancials.filter((f) => f.type === 'entrada').reduce((sum, f) => sum + (f.amount || 0), 0)
  const monthExpenses = monthFinancials.filter((f) => f.type === 'saida').reduce((sum, f) => sum + (f.amount || 0), 0)
  const balance = monthRevenue - monthExpenses

  const lastMonthRevenue = lastMonthFinancials.filter((f) => f.type === 'entrada').reduce((sum, f) => sum + (f.amount || 0), 0)
  const revenueGrowth = lastMonthRevenue > 0
    ? (((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(0)
    : 0

  const lowStockItems = stocks.filter((item) => item.quantity <= item.min_quantity)
  const recurringClients = clients.filter((c) => (c.total_services || 0) > 2)

  const monthlyGoal = 30
  const progress = Math.round((completedMonth.length / monthlyGoal) * 100)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        <KPICard title="Serviços Hoje" value={todayOrders.length} icon={Calendar} color="cyan" subtitle="Agendados para hoje" />
        <KPICard title="Atrasados" value={delayedOrders.length} icon={Clock} color="amber" subtitle="Pendentes vencidos" />
        <KPICard title="Críticos" value={criticalOrders.length} icon={Zap} color="red" subtitle="Urgentes em aberto" />
        <KPICard title="Esta Semana" value={weekOrders.length} icon={Calendar} color="blue" subtitle="Serviços agendados" />
        <KPICard title="Faturamento" value={`R$ ${(monthRevenue / 1000).toFixed(1)}k`} icon={TrendingUp} color="green" trend={Number(revenueGrowth) >= 0 ? 'up' : 'down'} trendValue={`${revenueGrowth}%`} subtitle="Receita do mês" />
        <KPICard title="Despesas" value={`R$ ${(monthExpenses / 1000).toFixed(1)}k`} icon={TrendingDown} color="red" subtitle="Gastos do mês" />
        <KPICard title="Saldo" value={`R$ ${(balance / 1000).toFixed(1)}k`} icon={Wallet} color={balance >= 0 ? 'green' : 'red'} subtitle="Resultado operacional" />
        <KPICard title="Estoque Baixo" value={lowStockItems.length} icon={Package} color={lowStockItems.length > 0 ? 'amber' : 'green'} subtitle="Itens a repor" />
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <CheckCircle className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Meta Mensal</p>
              <p className="text-xs text-muted-foreground">{completedMonth.length} de {monthlyGoal} serviços concluídos</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-cyan-400">{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
      </div>

      {/* Seções adicionais removidas temporariamente até APIs e componentes existirem */}
    </div>
  )
}
