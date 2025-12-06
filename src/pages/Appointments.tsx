import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { appointments, clients, services } from '../mock/data'
import { Appointment, AppointmentStatus } from '../types'

export default function Appointments() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<AppointmentStatus | 'all'>('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Appointment>>({})

  const data = useMemo(() => {
    return appointments.filter(a => {
      const matchesStatus = status === 'all' || a.status === status
      const c = clients.find(c => c.id === a.clientId)
      const s = services.find(s => s.id === a.serviceId)
      const text = `${c?.name ?? ''} ${s?.name ?? ''}`.toLowerCase()
      const matchesQuery = text.includes(query.toLowerCase())
      return matchesStatus && matchesQuery
    })
  }, [query, status])

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Agendamentos</div>
        <Button onClick={() => setOpen(true)}>Novo agendamento</Button>
      </div>
      <Card>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Input label="Buscar" value={query} onChange={e => setQuery(e.target.value)} placeholder="cliente ou serviço" />
          <Select label="Status" value={status} onChange={e => setStatus(e.target.value as any)}>
            <option value="all">Todos</option>
            <option value="pending">Pendente</option>
            <option value="confirmed">Confirmado</option>
            <option value="done">Concluído</option>
            <option value="cancelled">Cancelado</option>
          </Select>
        </div>
      </Card>
      <Card>
        <ul className="space-y-2">
          {data.map(a => {
            const c = clients.find(c => c.id === a.clientId)
            const s = services.find(s => s.id === a.serviceId)
            return (
              <li key={a.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{c?.name} • {s?.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{a.date} {a.time}</div>
                </div>
                <div className="text-xs">{a.status}</div>
              </li>
            )
          })}
        </ul>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Novo Agendamento">
        <div className="space-y-2">
          <Select label="Cliente" value={form.clientId ?? ''} onChange={e => setForm({ ...form, clientId: e.target.value })}>
            <option value="">Selecione</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select label="Serviço" value={form.serviceId ?? ''} onChange={e => setForm({ ...form, serviceId: e.target.value })}>
            <option value="">Selecione</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </Select>
          <Input label="Data" type="date" value={form.date ?? ''} onChange={e => setForm({ ...form, date: e.target.value })} />
          <Input label="Hora" type="time" value={form.time ?? ''} onChange={e => setForm({ ...form, time: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
