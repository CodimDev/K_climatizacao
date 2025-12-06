import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { serviceOrders, clients } from '../mock/data'

export default function MaintenanceHistory() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'in_progress' | 'done'>('all')
  const data = useMemo(() => serviceOrders.filter(o => {
    const matchesStatus = status === 'all' || o.status === status
    const c = clients.find(c => c.id === o.clientId)
    const text = `${o.id} ${o.title} ${c?.name ?? ''}`.toLowerCase()
    return matchesStatus && text.includes(query.toLowerCase())
  }).sort((a,b)=> (a.scheduledAt ?? '').localeCompare(b.scheduledAt ?? '')), [query, status])

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="text-2xl font-semibold">Histórico de Manutenções</div>
      <Card>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Input label="Buscar" value={query} onChange={e => setQuery(e.target.value)} />
          <Select label="Status" value={status} onChange={e => setStatus(e.target.value as any)}>
            <option value="all">Todos</option>
            <option value="in_progress">Em andamento</option>
            <option value="done">Concluído</option>
          </Select>
        </div>
      </Card>
      <Card>
        <ul className="space-y-2">
          {data.map(o => (
            <li key={o.id} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{o.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{o.scheduledAt ? new Date(o.scheduledAt).toLocaleString('pt-BR') : '-'}</div>
              </div>
              <div className="text-xs">{o.status}</div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
