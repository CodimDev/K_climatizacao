import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { stock } from '../mock/data'

export default function Stock() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const data = useMemo(() => stock.filter(s => s.name.toLowerCase().includes(query.toLowerCase())), [query])
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Estoque</div>
        <Button onClick={() => setOpen(true)}>Nova entrada</Button>
      </div>
      <Card>
        <Input label="Buscar" value={query} onChange={e => setQuery(e.target.value)} placeholder="item" />
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map(s => (
          <Card key={s.id} title={s.name}>
            <div className="text-sm">Qtd: {s.quantity}</div>
            {typeof s.minQuantity === 'number' && s.quantity < s.minQuantity && (
              <div className="text-xs text-amber-600">Abaixo do mínimo</div>
            )}
          </Card>
        ))}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="Movimentação">
        <div className="space-y-2">
          <Input label="Item" placeholder="ex.: Filtro 12k" />
          <Input label="Quantidade" type="number" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={() => setOpen(false)}>Salvar</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
