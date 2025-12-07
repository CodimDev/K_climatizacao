// @ts-nocheck
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '@/api/base44Client'
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isToday,
  subMonths,
} from 'date-fns'
import {
  Calendar,
  Clock,
  AlertTriangle,
  Zap,
  TrendingUp,
  TrendingDown,
  Wallet,
  Package,
  Users,
  Wrench,
  CheckCircle,
} from 'lucide-react'

import KPICard from '@/components/ui/KPICard'
import TimelineCard from '@/components/dashboard/TimelineCard'
import WeekView from '@/components/dashboard/WeekView'
import PriorityPanel from '@/components/dashboard/PriorityPanel'
import FinanceChart from '@/components/dashboard/FinanceChart'

export default function Dashboard() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const weekStart = format(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  )
  const weekEnd = format(
    endOfWeek(new Date(), { weekStartsOn: 1 }),
    'yyyy-MM-dd'
  )
  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')
  const lastMonthStart = format(
    startOfMonth(subMonths(new Date(), 1)),
    'yyyy-MM-dd'
  )
  const lastMonthEnd = format(
    endOfMonth(subMonths(new Date(), 1)),
    'yyyy-MM-dd'
  )

  const { data: serviceOrders = [] } = useQuery({
    queryKey: ['service-orders'],
    queryFn: () => base44.entities.ServiceOrder.list('-created_date', 200),
  })

  const { data: financials = [] } = useQuery({
    queryKey: ['financials'],
    queryFn: () => base44.entities.Financial.list('-date', 200),
  })

  const { data: stocks = [] } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => base44.entities.Stock.list(),
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  })

  // Calculate KPIs
  const todayOrders = serviceOrders.filter((so) => so.scheduled_date === today)
  const weekOrders = serviceOrders.filter(
    (so) => so.scheduled_date >= weekStart && so.scheduled_date <= weekEnd
  )
  const delayedOrders = serviceOrders.filter(
    (so) =>
      so.status !== 'concluido' &&
      so.status !== 'cancelado' &&
      so.scheduled_date < today
  )
  const criticalOrders = serviceOrders.filter(
    (so) => so.priority === 'urgente' && so.status !== 'concluido'
  )
  const completedMonth = serviceOrders.filter(
    (so) =>
      so.scheduled_date >= monthStart &&
      so.scheduled_date <= monthEnd &&
      so.status === 'concluido'
  )

  // Financial calculations
  const monthFinancials = financials.filter(
    (f) => f.date >= monthStart && f.date <= monthEnd
  )
  const lastMonthFinancials = financials.filter(
    (f) => f.date >= lastMonthStart && f.date <= lastMonthEnd
  )

  const monthRevenue = monthFinancials
    .filter((f) => f.type === 'entrada')
    .reduce((sum, f) => sum + (f.amount || 0), 0)
  const monthExpenses = monthFinancials
    .filter((f) => f.type === 'saida')
    .reduce((sum, f) => sum + (f.amount || 0), 0)
  const balance = monthRevenue - monthExpenses

  const lastMonthRevenue = lastMonthFinancials
    .filter((f) => f.type === 'entrada')
    .reduce((sum, f) => sum + (f.amount || 0), 0)
  const revenueGrowth =
    lastMonthRevenue > 0
      ? (((monthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(
          0
        )
      : 0

  // Stock alerts
  const lowStockItems = stocks.filter(
    (item) => item.quantity <= item.min_quantity
  )

  // Recurring clients (more than 2 services)
  const recurringClients = clients.filter((c) => (c.total_services || 0) > 2)

  // Progress calculation (goal: 30 services/month)
  const monthlyGoal = 30
  const progress = Math.round((completedMonth.length / monthlyGoal) * 100)

  const start = new Date(monthStart)
  const end = new Date(monthEnd)
  const series: any[] = []
  for (
    let d = new Date(start);
    d <= end;
    d = new Date(d.getTime() + 86400000)
  ) {
    const key = format(d, 'yyyy-MM-dd')
    const receita = monthFinancials
      .filter((f) => f.type === 'entrada' && f.date === key)
      .reduce((sum, f) => sum + (f.amount || 0), 0)
    const despesa = monthFinancials
      .filter((f) => f.type === 'saida' && f.date === key)
      .reduce((sum, f) => sum + (f.amount || 0), 0)
    series.push({
      dateLabel: format(d, 'dd/MM'),
      receita,
      despesa,
      saldo: receita - despesa,
    })
  }

  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        <KPICard
          title="Serviços Hoje"
          value={todayOrders.length}
          icon={Calendar}
          color="cyan"
          subtitle="Agendados para hoje"
        />
        <KPICard
          title="Atrasados"
          value={delayedOrders.length}
          icon={Clock}
          color="amber"
          subtitle="Pendentes vencidos"
        />
        <KPICard
          title="Críticos"
          value={criticalOrders.length}
          icon={Zap}
          color="red"
          subtitle="Urgentes em aberto"
        />
        <KPICard
          title="Esta Semana"
          value={weekOrders.length}
          icon={Calendar}
          color="blue"
          subtitle="Serviços agendados"
        />
        <KPICard
          title="Faturamento"
          value={`R$ ${(monthRevenue / 1000).toFixed(1)}k`}
          icon={TrendingUp}
          color="green"
          trend={Number(revenueGrowth) >= 0 ? 'up' : 'down'}
          trendValue={`${revenueGrowth}%`}
          subtitle="Receita do mês"
        />
        <KPICard
          title="Despesas"
          value={`R$ ${(monthExpenses / 1000).toFixed(1)}k`}
          icon={TrendingDown}
          color="red"
          subtitle="Gastos do mês"
        />
        <KPICard
          title="Saldo"
          value={`R$ ${(balance / 1000).toFixed(1)}k`}
          icon={Wallet}
          color={balance >= 0 ? 'green' : 'red'}
          subtitle="Resultado operacional"
        />
        <KPICard
          title="Estoque Baixo"
          value={lowStockItems.length}
          icon={Package}
          color={lowStockItems.length > 0 ? 'amber' : 'green'}
          subtitle="Itens a repor"
        />
      </div>

      {/* Progress bar */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <CheckCircle className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Meta Mensal</p>
              <p className="text-xs text-muted-foreground">
                {completedMonth.length} de {monthlyGoal} serviços concluídos
              </p>
            </div>
          </div>
          <span className="text-2xl font-bold text-cyan-400">{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="lg:col-span-1">
          <TimelineCard items={todayOrders} title="Agenda de Hoje" />
        </div>

        {/* Week view */}
        <div className="lg:col-span-2">
          <WeekView appointments={serviceOrders} />
        </div>
      </div>

      {/* Bottom grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Finance chart */}
        <div className="lg:col-span-2">
          <FinanceChart
            data={series}
            revenue={monthRevenue}
            expenses={monthExpenses}
            balance={balance}
          />
        </div>

        {/* Priority panel */}
        <div className="lg:col-span-1">
          <PriorityPanel
            urgentServices={criticalOrders}
            lowStockItems={lowStockItems}
            recurringClients={recurringClients}
          />
        </div>
      </div>
    </div>
  )
}
