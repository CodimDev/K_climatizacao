import Card from '../ui/Card'
import { KPI } from '../../types'

type Props = { kpi: KPI }

export default function KPICard({ kpi }: Props) {
  const color = kpi.delta && kpi.delta !== 0 ? (kpi.delta > 0 ? 'text-emerald-600' : 'text-rose-600') : 'text-gray-500'
  return (
    <Card>
      <div className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</div>
      <div className="mt-1 text-2xl font-semibold">{Intl.NumberFormat('pt-BR').format(kpi.value)}</div>
      {typeof kpi.delta === 'number' && (
        <div className={`mt-1 text-xs ${color}`}>{kpi.delta > 0 ? '+' : ''}{kpi.delta}%</div>
      )}
    </Card>
  )
}
