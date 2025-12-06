import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import StatusBadge from '../components/ui/StatusBadge'
import PriorityBadge from '../components/ui/PriorityBadge'
import Modal from '../components/ui/Modal'
import Select from '../components/ui/Select'
import Input from '../components/ui/Input'
import { clients, serviceOrders, stock } from '../mock/data'
import { StockMovement } from '../types'

export default function ServiceOrderDetails() {
  const { id } = useParams()
  const order = useMemo(() => serviceOrders.find(o => o.id === id), [id])
  const client = useMemo(() => clients.find(c => c.id === order?.clientId), [order])
  const [materialOpen, setMaterialOpen] = useState(false)
  const [movement, setMovement] = useState<Partial<StockMovement>>({ type: 'out', quantity: 1 })

  if (!order) return <div className="mx-auto max-w-7xl p-4">OS não encontrada</div>

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">{order.id}</div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={order.priority} />
          <StatusBadge status={order.status} />
        </div>
      </div>

      <Card title="Cliente">
        <div className="text-sm">{client?.name}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{client?.phone}</div>
      </Card>

      <Card title="Agendamento">
        <div className="text-sm">{order.scheduledAt ? new Date(order.scheduledAt).toLocaleString('pt-BR') : '-'}</div>
      </Card>

      <Card title="Materiais">
        <div className="flex justify-end">
          <Button size="sm" onClick={() => setMaterialOpen(true)}>Adicionar material</Button>
        </div>
      </Card>

      <Modal open={materialOpen} onClose={() => setMaterialOpen(false)} title="Adicionar Material">
        <div className="space-y-2">
          <Select label="Item" value={movement.itemId ?? ''} onChange={e => setMovement({ ...movement, itemId: e.target.value })}>
            <option value="">Selecione</option>
            {stock.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Input label="Quantidade" type="number" value={movement.quantity?.toString() ?? '1'} onChange={e => setMovement({ ...movement, quantity: Number(e.target.value) })} />
          <Input label="Motivo" value={movement.reason ?? ''} onChange={e => setMovement({ ...movement, reason: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setMaterialOpen(false)}>Cancelar</Button>
            <Button onClick={() => setMaterialOpen(false)}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
