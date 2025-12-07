import Card from '../ui/Card'
import { ComponentType } from 'react'

type Props = {
  title: string
  value: string | number
  icon: ComponentType<{ className?: string }>
  color?: 'cyan' | 'amber' | 'red' | 'blue' | 'green' | 'purple'
  subtitle?: string
  trend?: 'up' | 'down'
  trendValue?: string
}

export default function KPICard({ title, value, icon: Icon, color = 'cyan', subtitle, trend, trendValue }: Props) {
  const palette = {
    cyan: 'text-cyan-600',
    amber: 'text-amber-600',
    red: 'text-rose-600',
    blue: 'text-blue-600',
    green: 'text-emerald-600',
    purple: 'text-purple-600',
  }[color]
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{title}</div>
        <div className={`rounded-md p-1 ${palette}`}><Icon className="w-4 h-4" /></div>
      </div>
      <div className="mt-1 text-2xl font-semibold">{typeof value === 'number' ? Intl.NumberFormat('pt-BR').format(value) : value}</div>
      {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
      {trend && trendValue && (
        <div className={`mt-1 text-xs ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>{trendValue}</div>
      )}
    </Card>
  )
}
