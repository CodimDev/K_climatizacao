import React from 'react'

type Props = {
  urgentServices?: any[]
  lowStockItems?: any[]
  recurringClients?: any[]
}

export default function PriorityPanel({
  urgentServices = [],
  lowStockItems = [],
  recurringClients = [],
}: Props) {
  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-medium text-white/60">Prioridades</h3>
      <div className="text-xs text-white/70">Urgentes: {urgentServices.length}</div>
      <div className="text-xs text-white/70">Estoque baixo: {lowStockItems.length}</div>
      <div className="text-xs text-white/70">Clientes recorrentes: {recurringClients.length}</div>
    </div>
  )
}
