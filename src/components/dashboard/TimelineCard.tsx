import Card from '../ui/Card'
import PriorityBadge from '../ui/PriorityBadge'
import StatusBadge from '../ui/StatusBadge'
import { ServiceOrder } from '../../types'

type Props = { items: ServiceOrder[]; title?: string }

export default function TimelineCard({ items, title = 'Hoje' }: Props) {
  return (
    <Card title={title}>
      <ul className="space-y-3">
        {items.map(it => (
          <li key={it.id} className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{it.title}</div>
              {it.scheduledAt && <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(it.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>}
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={it.priority} />
              <StatusBadge status={it.status} />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
