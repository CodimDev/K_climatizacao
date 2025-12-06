import Card from '../ui/Card'
import { KPI } from '../../types'
import { ReactNode } from 'react'

type Props = { kpi: KPI & { icon?: ReactNode; colorClass?: string } }

export default function KPICard({ kpi }: Props) {
  const color = kpi.delta && kpi.delta !== 0 ? (kpi.delta > 0 ? 'text-emerald-600' : 'text-rose-600') : 'text-gray-500'
  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</div>
        {kpi.icon && <div className={`rounded-md p-1 ${kpi.colorClass ?? ''}`}>{kpi.icon}</div>}
      </div>
      <div className="mt-1 text-2xl font-semibold">{Intl.NumberFormat('pt-BR').format(kpi.value)}</div>
      {typeof kpi.delta === 'number' && (
        <div className={`mt-1 text-xs ${color}`}>{kpi.delta > 0 ? '+' : ''}{kpi.delta}%</div>
      )}
    </Card>
  )
}
