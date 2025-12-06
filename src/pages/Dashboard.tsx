import KPICard from '../components/dashboard/KPICard'
import FinanceChart from '../components/dashboard/FinanceChart'
import TimelineCard from '../components/dashboard/TimelineCard'
import PriorityPanel from '../components/dashboard/PriorityPanel'
import WeekView from '../components/dashboard/WeekView'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { kpis, financeSeries, todayOrders, priorityOrders, weekDays } from '../mock/dashboard'
import { useTheme } from '../contexts/ThemeContext'

export default function Dashboard() {
  const { toggle, theme } = useTheme()
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Dashboard</div>
        <Button variant="secondary" onClick={toggle}>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(k => <KPICard key={k.label} kpi={k} />)}
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
    </div>
  )
}
