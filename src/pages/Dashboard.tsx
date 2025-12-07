import KPICard from '../components/dashboard/KPICard'
import FinanceChart from '../components/dashboard/FinanceChart'
import TimelineCard from '../components/dashboard/TimelineCard'
import PriorityPanel from '../components/dashboard/PriorityPanel'
import WeekView from '../components/dashboard/WeekView'
import {} from '../components/ui/Button'
import { useQuery } from '@tanstack/react-query'
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subMonths,
} from 'date-fns'
import {
  serviceOrders as soData,
  transactions as finData,
  stock as stockData,
  clients as clientsData,
} from '../mock/data'
import {
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  Wallet,
  Package as PackageIcon,
} from 'lucide-react'

export default function Dashboard() {
  const soQ = useQuery({
    queryKey: ['serviceOrders'],
    queryFn: async () => soData,
  })
  const finQ = useQuery({
    queryKey: ['financials'],
    queryFn: async () => finData,
  })
  const stockQ = useQuery({
    queryKey: ['stocks'],
    queryFn: async () => stockData,
  })
  const clientsQ = useQuery({
    queryKey: ['clients'],
    queryFn: async () => clientsData,
  })

  const loading =
    soQ.isLoading || finQ.isLoading || stockQ.isLoading || clientsQ.isLoading
  const serviceOrders = soQ.data ?? []
  const transactions = finQ.data ?? []
  const stock = stockQ.data ?? []

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

  const todayOrders = serviceOrders.filter(
    (so) =>
      so.scheduledAt && format(new Date(so.scheduledAt), 'yyyy-MM-dd') === today
  )
  const weeklyOrders = serviceOrders.filter(
    (so) =>
      so.scheduledAt &&
      format(new Date(so.scheduledAt), 'yyyy-MM-dd') >= weekStart &&
      format(new Date(so.scheduledAt), 'yyyy-MM-dd') <= weekEnd
  )

  const monthlyIncome = transactions
    .filter(
      (t) =>
        t.type === 'income' &&
        format(new Date(t.date), 'yyyy-MM-dd') >= monthStart &&
        format(new Date(t.date), 'yyyy-MM-dd') <= monthEnd
    )
    .reduce((a, b) => a + (b.amount || 0), 0)
  const monthlyExpense = transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        format(new Date(t.date), 'yyyy-MM-dd') >= monthStart &&
        format(new Date(t.date), 'yyyy-MM-dd') <= monthEnd
    )
    .reduce((a, b) => a + (b.amount || 0), 0)
  const monthlyBalance = monthlyIncome - monthlyExpense

  const lastMonthIncome = transactions
    .filter(
      (t) =>
        t.type === 'income' &&
        format(new Date(t.date), 'yyyy-MM-dd') >= lastMonthStart &&
        format(new Date(t.date), 'yyyy-MM-dd') <= lastMonthEnd
    )
    .reduce((a, b) => a + (b.amount || 0), 0)
  const revenueGrowth = lastMonthIncome
    ? Math.round(((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100)
    : 0

  const lowStockItems = stock.filter(
    (s) =>
      typeof s.minQuantity === 'number' && s.quantity <= (s.minQuantity ?? 0)
  )
  const criticalOrders = serviceOrders.filter((o) => o.priority === 'urgent')

  const financeSeries = (() => {
    const byDay: Record<string, { income: number; expense: number }> = {}
    transactions.forEach((t) => {
      const day = format(new Date(t.date), 'dd/MM')
      if (!byDay[day]) byDay[day] = { income: 0, expense: 0 }
      if (t.type === 'income') byDay[day].income += t.amount || 0
      else byDay[day].expense += t.amount || 0
    })
    return Object.entries(byDay).map(([date, v]) => ({
      date,
      income: v.income,
      expense: v.expense,
    }))
  })()

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="text-2xl font-semibold">Dashboard</div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          Carregando dados...
        </div>
      ) : (
        <>
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
              value={
                serviceOrders.filter(
                  (so) =>
                    so.scheduledAt &&
                    format(new Date(so.scheduledAt), 'yyyy-MM-dd') < today &&
                    so.status !== 'done' &&
                    so.status !== 'cancelled'
                ).length
              }
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
              value={weeklyOrders.length}
              icon={Calendar}
              color="blue"
              subtitle="Serviços agendados"
            />
            <KPICard
              title="Faturamento"
              value={`R$ ${(monthlyIncome / 1000).toFixed(1)}k`}
              icon={TrendingUp}
              color="green"
              trend={revenueGrowth >= 0 ? 'up' : 'down'}
              trendValue={`${revenueGrowth}%`}
              subtitle="Receita do mês"
            />
            <KPICard
              title="Despesas"
              value={`R$ ${(monthlyExpense / 1000).toFixed(1)}k`}
              icon={TrendingDown}
              color="red"
              subtitle="Gastos do mês"
            />
            <KPICard
              title="Saldo"
              value={`R$ ${(monthlyBalance / 1000).toFixed(1)}k`}
              icon={Wallet}
              color={monthlyBalance >= 0 ? 'green' : 'red'}
              subtitle="Resultado operacional"
            />
            <KPICard
              title="Estoque Baixo"
              value={lowStockItems.length}
              icon={PackageIcon}
              color={lowStockItems.length > 0 ? 'amber' : 'green'}
              subtitle="Itens a repor"
            />
          </div>

          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <Wallet className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Meta Mensal
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {serviceOrders.filter((so) => so.status === 'done').length}{' '}
                    de 30 serviços concluídos
                  </p>
                </div>
              </div>
              <span className="text-2xl font-bold text-cyan-400">
                {Math.round(
                  (serviceOrders.filter((so) => so.status === 'done').length /
                    30) *
                    100
                )}
                %
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    Math.round(
                      (serviceOrders.filter((so) => so.status === 'done')
                        .length /
                        30) *
                        100
                    ),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-1">
              <TimelineCard items={todayOrders} title="Agenda de Hoje" />
            </div>
            <div className="lg:col-span-2">
              <WeekView appointments={serviceOrders} />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2">
              <FinanceChart data={financeSeries} />
            </div>
            <div className="lg:col-span-1">
              <PriorityPanel
                urgentServices={criticalOrders}
                lowStockItems={lowStockItems}
                recurringClients={[]}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
