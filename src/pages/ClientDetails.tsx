import { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { clients, serviceOrders, equipments } from '../mock/data'

export default function ClientDetails() {
  const { id } = useParams()
  const client = useMemo(() => clients.find(c => c.id === id), [id])
  const upcoming = useMemo(() => serviceOrders.filter(o => o.clientId === id && o.status !== 'done'), [id])
  const history = useMemo(() => serviceOrders.filter(o => o.clientId === id && o.status === 'done'), [id])
  const clientEquipments = useMemo(() => equipments.filter(e => e.clientId === id), [id])

  if (!client) return <div className="mx-auto max-w-7xl p-4">Cliente não encontrado</div>

  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">{client.name}</div>
        <Button size="sm">Editar</Button>
      </div>
      <Card title="Detalhes">
        <div className="text-sm">{client.phone}</div>
        <div className="text-sm">{client.address}</div>
      </Card>
      <Card title="Equipamentos">
        <ul className="text-sm space-y-1">
          {clientEquipments.map(e => (
            <li key={e.id}><Link to={`/equipments/${e.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">{e.type} {e.brand} {e.model}</Link></li>
          ))}
        </ul>
      </Card>
      <Card title="Agendados">
        <ul className="text-sm space-y-1">
          {upcoming.map(o => (
            <li key={o.id}><Link to={`/service-orders/${o.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">{o.title}</Link></li>
          ))}
        </ul>
      </Card>
      <Card title="Histórico">
        <ul className="text-sm space-y-1">
          {history.map(o => (
            <li key={o.id}><Link to={`/service-orders/${o.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">{o.title}</Link></li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
