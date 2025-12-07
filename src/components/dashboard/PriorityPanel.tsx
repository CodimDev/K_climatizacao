import Card from '../ui/Card'
import PriorityBadge from '../ui/PriorityBadge'
import StatusBadge from '../ui/StatusBadge'
import Button from '../ui/Button'
import { Client, ServiceOrder, StockItem } from '../../types'

type Props = { urgentServices: ServiceOrder[]; lowStockItems: StockItem[]; recurringClients: Client[] }

export default function PriorityPanel({ urgentServices, lowStockItems, recurringClients }: Props) {
  return (
    <Card title="Prioridades">
      <div className="space-y-4">
        <div>
          <div className="text-sm font-semibold">Serviços urgentes</div>
          <div className="mt-2 space-y-3">
            {urgentServices.map(it => (
              <div key={it.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium">{it.title}</div>
                  <div className="text-xs text-muted-foreground">#{it.id}</div>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={it.priority} />
                  <StatusBadge status={it.status} />
                  <Button size="sm" variant="ghost">Detalhes</Button>
                </div>
              </div>
            ))}
            {urgentServices.length === 0 && <div className="text-xs text-muted-foreground">Sem urgências</div>}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold">Estoque baixo</div>
          <div className="mt-2 space-y-2">
            {lowStockItems.map(s => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <div>{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.quantity}/{s.minQuantity}</div>
              </div>
            ))}
            {lowStockItems.length === 0 && <div className="text-xs text-muted-foreground">Sem alertas</div>}
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold">Clientes recorrentes</div>
          <div className="mt-2 space-y-2">
            {recurringClients.map(c => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <div>{c.name}</div>
                <div className="text-xs text-muted-foreground">recorrente</div>
              </div>
            ))}
            {recurringClients.length === 0 && <div className="text-xs text-muted-foreground">Sem recorrências</div>}
          </div>
        </div>
      </div>
    </Card>
  )
}
