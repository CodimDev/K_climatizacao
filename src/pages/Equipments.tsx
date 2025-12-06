import { useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { equipments, clients } from '../mock/data'

export default function Equipments() {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<'all' | string>('all')

  const types = Array.from(new Set(equipments.map(e => e.type)))
  const data = useMemo(() => equipments.filter(e => {
    const matchesType = type === 'all' || e.type === type
    const text = `${e.brand} ${e.model} ${e.serialNumber ?? ''}`.toLowerCase()
    const matchesQuery = text.includes(query.toLowerCase())
    return matchesType && matchesQuery
  }), [query, type])

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="text-2xl font-semibold">Equipamentos</div>
      <Card>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <Input label="Buscar" value={query} onChange={e => setQuery(e.target.value)} placeholder="marca, modelo, série" />
          <Select label="Tipo" value={type} onChange={e => setType(e.target.value)}>
            <option value="all">Todos</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Tipo</th>
                <th className="p-2">Marca</th>
                <th className="p-2">Modelo</th>
                <th className="p-2">Capacidade</th>
                <th className="p-2">Cliente</th>
              </tr>
            </thead>
            <tbody>
              {data.map(e => {
                const c = clients.find(c => c.id === e.clientId)
                return (
                  <tr key={e.id} className="border-t border-gray-200 dark:border-gray-800">
                    <td className="p-2">{e.type}</td>
                    <td className="p-2">{e.brand}</td>
                    <td className="p-2">{e.model}</td>
                    <td className="p-2">{e.capacity}</td>
                    <td className="p-2">{c?.name}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
