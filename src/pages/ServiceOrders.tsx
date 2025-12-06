import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import StatusBadge from '../components/ui/StatusBadge'
import PriorityBadge from '../components/ui/PriorityBadge'
import { clients, serviceOrders, services } from '../mock/data'
import { ServiceOrder, Status } from '../types'
import { Link } from 'react-router-dom'

export default function ServiceOrders() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<ServiceOrder>>({})

  const data = useMemo(() => {
    return serviceOrders.filter(o => {
      const matchesStatus = status === 'all' || o.status === status
      const c = clients.find(c => c.id === o.clientId)
      const text = `${o.id} ${o.title} ${c?.name ?? ''}`.toLowerCase()
      const matchesQuery = text.includes(query.toLowerCase())
      return matchesStatus && matchesQuery
    })
  }, [query, status])

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Ordens de Serviço</div>
        <Button onClick={() => setOpen(true)}>Nova OS</Button>
      </div>
      <Card>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Input label="Buscar" value={query} onChange={e => setQuery(e.target.value)} placeholder="cliente, OS, serviço" />
          <Select label="Status" value={status} onChange={e => setStatus(e.target.value as any)}>
            <option value="all">Todos</option>
            <option value="open">Pendente</option>
            <option value="in_progress">Em execução</option>
            <option value="done">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </Select>
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left"> 
                <th className="p-2">OS</th>
                <th className="p-2">Cliente</th>
                <th className="p-2">Serviço</th>
                <th className="p-2">Agendado</th>
                <th className="p-2">Status</th>
                <th className="p-2">Prioridade</th>
              </tr>
            </thead>
            <tbody>
              {data.map(o => {
                const client = clients.find(c => c.id === o.clientId)
                const service = services.find(s => s.id === o.equipmentId)
                return (
                  <tr key={o.id} className="border-t border-gray-200 dark:border-gray-800">
                    <td className="p-2"><Link to={`/service-orders/${o.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">{o.id}</Link></td>
                    <td className="p-2">{client?.name}</td>
                    <td className="p-2">{o.title}</td>
                    <td className="p-2">{o.scheduledAt ? new Date(o.scheduledAt).toLocaleString('pt-BR') : '-'}</td>
                    <td className="p-2"><StatusBadge status={o.status} /></td>
                    <td className="p-2"><PriorityBadge priority={o.priority} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Nova OS">
        <div className="space-y-2">
          <Input label="Título" value={form.title ?? ''} onChange={e => setForm({ ...form, title: e.target.value })} />
          <Select label="Cliente" value={form.clientId ?? ''} onChange={e => setForm({ ...form, clientId: e.target.value })}>
            <option value="">Selecione</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="Prioridade" value={form.priority ?? 'medium'} onChange={e => setForm({ ...form, priority: e.target.value as any })}>
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </Select>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
