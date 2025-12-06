import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/ui/Card'
import { equipments, clients, serviceOrders } from '../mock/data'

export default function EquipmentDetails() {
  const { id } = useParams()
  const eq = useMemo(() => equipments.find(e => e.id === id), [id])
  const client = useMemo(() => clients.find(c => c.id === eq?.clientId), [eq])
  const related = useMemo(() => serviceOrders.filter(o => o.equipmentId === id), [id])
  if (!eq) return <div className="mx-auto max-w-7xl p-4">Equipamento não encontrado</div>
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="text-2xl font-semibold">{eq.type} {eq.brand} {eq.model}</div>
      <Card title="Detalhes do Equipamento">
        <div className="text-sm">Capacidade: {eq.capacity}</div>
        <div className="text-sm">Série: {eq.serialNumber}</div>
      </Card>
      <Card title="Cliente">
        <div className="text-sm">{client?.name}</div>
      </Card>
      <Card title="Ordens relacionadas">
        <ul className="text-sm space-y-1">
          {related.map(o => (<li key={o.id}>{o.title}</li>))}
        </ul>
      </Card>
    </div>
  )
}
