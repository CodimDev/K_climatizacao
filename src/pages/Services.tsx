import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { services } from '../mock/data'
import { Service } from '../types'

export default function Services() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Service>>({})
  const data = useMemo(() => services.filter(s => s.name.toLowerCase().includes(query.toLowerCase())), [query])
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Serviços</div>
        <Button onClick={() => setOpen(true)}>Novo serviço</Button>
      </div>
      <Card>
        <Input label="Buscar" value={query} onChange={e => setQuery(e.target.value)} placeholder="nome ou categoria" />
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(s => (
          <Card key={s.id} title={s.name}>
            <div className="text-sm">R$ {s.price.toFixed(2)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{s.category}</div>
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Novo Serviço">
        <div className="space-y-2">
          <Input label="Nome" value={form.name ?? ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Preço" type="number" value={(form.price ?? 0).toString()} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
          <Input label="Duração (min)" type="number" value={(form.durationMinutes ?? 60).toString()} onChange={e => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
