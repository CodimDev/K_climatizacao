import KPICard from '../components/dashboard/KPICard'
import FinanceChart from '../components/dashboard/FinanceChart'
import TimelineCard from '../components/dashboard/TimelineCard'
import PriorityPanel from '../components/dashboard/PriorityPanel'
import WeekView from '../components/dashboard/WeekView'
import Button from '../components/ui/Button'
import { useTheme } from '../contexts/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { serviceOrders as soData, transactions as finData, stock as stockData } from '../mock/data'
import { ClipboardList, DollarSign, Package, Users, AlertTriangle, ArrowUp, Clock } from 'lucide-react'

export default function Dashboard() {
  const { toggle, theme } = useTheme()
  const soQ = useQuery({ queryKey: ['serviceOrders'], queryFn: async () => soData })
  const finQ = useQuery({ queryKey: ['financial'], queryFn: async () => finData })
  const stockQ = useQuery({ queryKey: ['stock'], queryFn: async () => stockData })

  const loading = soQ.isLoading || finQ.isLoading || stockQ.isLoading
  const serviceOrders = soQ.data ?? []
  const transactions = finQ.data ?? []
  const stock = stockQ.data ?? []

  const today = moment().startOf('day')
  const startOfWeek = moment().startOf('week')
  const endOfWeek = moment().endOf('week')
  const startOfMonth = moment().startOf('month')
  const endOfMonth = moment().endOf('month')

  const todayOrders = serviceOrders.filter(o => o.scheduledAt && moment(o.scheduledAt).isSame(today, 'day'))
  const weeklyOrders = serviceOrders.filter(o => o.scheduledAt && moment(o.scheduledAt).isBetween(startOfWeek, endOfWeek, undefined, '[]'))

  const monthlyIncome = transactions.filter(t => t.type === 'income' && moment(t.date).isBetween(startOfMonth, endOfMonth, undefined, '[]')).reduce((a,b)=>a+b.amount,0)
  const monthlyExpense = transactions.filter(t => t.type === 'expense' && moment(t.date).isBetween(startOfMonth, endOfMonth, undefined, '[]')).reduce((a,b)=>a+b.amount,0)
  const monthlyBalance = monthlyIncome - monthlyExpense

  const lastMonthIncome = transactions.filter(t => t.type === 'income' && moment(t.date).isBetween(moment().subtract(1,'month').startOf('month'), moment().subtract(1,'month').endOf('month'), undefined, '[]')).reduce((a,b)=>a+b.amount,0)
  const revenueGrowth = lastMonthIncome ? Math.round(((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100) : 0

  const lowStockItems = stock.filter(s => typeof s.minQuantity === 'number' && s.quantity <= (s.minQuantity ?? 0))
  const criticalOrders = serviceOrders.filter(o => o.priority === 'urgent')
  const priorityOrders = criticalOrders

  const weekDays = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map((d, idx) => {
    const day = moment(startOfWeek).add(idx, 'days')
    const count = serviceOrders.filter(o => o.scheduledAt && moment(o.scheduledAt).isSame(day, 'day')).length
    return { day: d, scheduled: count }
  })

  const financeSeries = (() => {
    const byDay: Record<string,{income:number,expense:number}> = {}
    transactions.forEach(t => {
      const day = moment(t.date).format('DD/MM')
      if (!byDay[day]) byDay[day] = { income:0, expense:0 }
      if (t.type === 'income') byDay[day].income += t.amount
      else byDay[day].expense += t.amount
    })
    return Object.entries(byDay).map(([date,v]) => ({ date, income: v.income, expense: v.expense }))
  })()

  const kpis = [
    { label: 'OS de hoje', value: todayOrders.length, icon: <ClipboardList className="w-4 h-4" />, colorClass: 'text-cyan-600' },
    { label: 'OS semana', value: weeklyOrders.length, icon: <Clock className="w-4 h-4" />, colorClass: 'text-blue-600' },
    { label: 'Receita mês', value: monthlyIncome, delta: revenueGrowth, icon: <DollarSign className="w-4 h-4" />, colorClass: 'text-emerald-600' },
    { label: 'Despesas mês', value: monthlyExpense, icon: <DollarSign className="w-4 h-4" />, colorClass: 'text-rose-600' },
    { label: 'Saldo', value: monthlyBalance, icon: <ArrowUp className="w-4 h-4" />, colorClass: 'text-purple-600' },
    { label: 'Estoque baixo', value: lowStockItems.length, icon: <Package className="w-4 h-4" />, colorClass: 'text-amber-600' },
  ]

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Dashboard</div>
        <Button variant="secondary" onClick={toggle}>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">Carregando dados...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map(k => <KPICard key={k.label} kpi={k as any} />)}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <FinanceChart data={financeSeries} />
            </div>
            <PriorityPanel items={priorityOrders} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TimelineCard items={todayOrders} />
            </div>
            <WeekView days={weekDays} />
          </div>
        </>
      )}
    </div>
  )
}
