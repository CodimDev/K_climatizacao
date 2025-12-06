import Card from '../ui/Card'
import PriorityBadge from '../ui/PriorityBadge'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'
import { ServiceOrder } from '../../types'

type Props = { items: ServiceOrder[] }

export default function PriorityPanel({ items }: Props) {
  return (
    <Card title="Prioridades">
      <div className="space-y-3">
        {items.map(it => (
          <div key={it.id} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-medium">{it.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">#{it.id}</div>
            </div>
            <div className="flex items-center gap-2">
              <PriorityBadge priority={it.priority} />
              <StatusBadge status={it.status} />
              <Button size="sm" variant="ghost">Detalhes</Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
