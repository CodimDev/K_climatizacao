import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { clients } from '../mock/data'
import { Client } from '../types'
import { Link } from 'react-router-dom'

export default function Clients() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Client>>({})

  const data = useMemo(() => clients.filter(c => (c.name.toLowerCase().includes(query.toLowerCase()) || (c.phone ?? '').includes(query))), [query])

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Clientes</div>
        <Button onClick={() => setOpen(true)}>Novo cliente</Button>
      </div>
      <Card>
        <Input label="Buscar" value={query} onChange={e => setQuery(e.target.value)} placeholder="nome, telefone" />
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(c => (
          <Card key={c.id} title={c.name}>
            <div className="text-sm">{c.phone}</div>
            <Link to={`/clients/${c.id}`} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">Detalhes</Link>
          </Card>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Novo Cliente">
        <div className="space-y-2">
          <Input label="Nome" value={form.name ?? ''} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Telefone" value={form.phone ?? ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Endereço" value={form.address ?? ''} onChange={e => setForm({ ...form, address: e.target.value })} />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
