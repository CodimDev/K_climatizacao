// @ts-nocheck
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '@/api/base44Client'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { format } from 'date-fns'
import {
  ArrowLeft,
  AirVent,
  User,
  Calendar,
  Wrench,
  Package,
  Clock,
  MapPin,
  Hash,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import StatusBadge from '@/components/ui/StatusBadge'

const typeLabels = {
  split: 'Split',
  janela: 'Janela',
  cassete: 'Cassete',
  piso_teto: 'Piso Teto',
  multi_split: 'Multi Split',
  central: 'Central',
}

export default function EquipmentDetails() {
  const urlParams = new URLSearchParams(window.location.search)
  const equipmentId = urlParams.get('id')

  const { data: equipment, isLoading } = useQuery({
    queryKey: ['equipment', equipmentId],
    queryFn: async () => {
      const equipments = await base44.entities.Equipment.filter({
        id: equipmentId,
      })
      return equipments[0]
    },
    enabled: !!equipmentId,
  })

  const { data: client } = useQuery({
    queryKey: ['client', equipment?.client_id],
    queryFn: async () => {
      const clients = await base44.entities.Client.filter({
        id: equipment.client_id,
      })
      return clients[0]
    },
    enabled: !!equipment?.client_id,
  })

  const { data: serviceOrders = [] } = useQuery({
    queryKey: ['equipment-orders', equipmentId],
    queryFn: () => base44.entities.ServiceOrder.list('-created_date', 500),
    enabled: !!equipmentId,
  })

  const relatedOrders = serviceOrders.filter(
    (so) =>
      so.equipment_type === equipment?.type &&
      so.client_id === equipment?.client_id
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  if (!equipment) {
    return (
      <div className="text-center py-10">
        <p className="text-white/40">Equipamento não encontrado</p>
        <Link to={createPageUrl('Equipments')}>
          <Button
            variant="outline"
            className="mt-4 border-white/10 text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={createPageUrl('Equipments')}>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">
              {equipment.brand} {equipment.model}
            </h1>
            <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
              {equipment.capacity} BTUs
            </Badge>
          </div>
          <p className="text-white/40 text-sm">{typeLabels[equipment.type]}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Equipment Info */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/20 flex items-center justify-center">
              <AirVent className="h-8 w-8 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">
                {equipment.brand}
              </h2>
              <p className="text-sm text-white/40">
                {equipment.model || 'Modelo não informado'}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-3 text-white/70">
              <AirVent className="h-4 w-4 text-white/40" />
              <div>
                <p className="text-xs text-white/40">Tipo</p>
                <p className="text-sm">{typeLabels[equipment.type]}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Hash className="h-4 w-4 text-white/40" />
              <div>
                <p className="text-xs text-white/40">Nº de Série</p>
                <p className="text-sm font-mono">
                  {equipment.serial_number || '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <MapPin className="h-4 w-4 text-white/40" />
              <div>
                <p className="text-xs text-white/40">Local</p>
                <p className="text-sm">{equipment.location || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Calendar className="h-4 w-4 text-white/40" />
              <div>
                <p className="text-xs text-white/40">Instalação</p>
                <p className="text-sm">
                  {equipment.installation_date
                    ? format(
                        new Date(equipment.installation_date),
                        'dd/MM/yyyy'
                      )
                    : '-'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <Wrench className="h-4 w-4 text-white/40" />
              <div>
                <p className="text-xs text-white/40">Última Manutenção</p>
                <p className="text-sm">
                  {equipment.last_maintenance
                    ? format(new Date(equipment.last_maintenance), 'dd/MM/yyyy')
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Client */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
            <User className="h-4 w-4" />
            Proprietário
          </h3>
          {client ? (
            <Link to={createPageUrl(`ClientDetails?id=${client.id}`)}>
              <div className="p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                    {client.name?.[0]}
                  </div>
                  <div>
                    <p className="font-medium text-white">{client.name}</p>
                    <p className="text-xs text-white/40">{client.phone}</p>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <p className="text-white/40 text-center py-6">
              Cliente não encontrado
            </p>
          )}

          {/* Próxima Preventiva */}
          <div className="mt-6 p-4 rounded-lg bg-amber-500/5 border border-amber-500/10">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-400">
                Próxima Preventiva
              </span>
            </div>
            <p className="text-white/60 text-sm">Recomendado a cada 6 meses</p>
            <p className="text-white text-sm mt-1">
              {equipment.last_maintenance
                ? format(
                    new Date(
                      new Date(equipment.last_maintenance).setMonth(
                        new Date(equipment.last_maintenance).getMonth() + 6
                      )
                    ),
                    'dd/MM/yyyy'
                  )
                : 'Sem data base'}
            </p>
          </div>
        </div>

        {/* History */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Histórico de Serviços
          </h3>
          {relatedOrders.length === 0 ? (
            <p className="text-white/40 text-center py-6">
              Nenhum serviço registrado
            </p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {relatedOrders.slice(0, 10).map((order) => (
                <Link
                  key={order.id}
                  to={createPageUrl(`ServiceOrderDetails?id=${order.id}`)}
                >
                  <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-cyan-400">
                        {order.order_number}
                      </span>
                      <StatusBadge status={order.status} size="xs" />
                    </div>
                    <p className="text-sm text-white">
                      {order.service_name || order.service_type}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                      {order.scheduled_date
                        ? format(new Date(order.scheduled_date), 'dd/MM/yyyy')
                        : '-'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Materials Used */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
          <Package className="h-4 w-4" />
          Materiais Utilizados (histórico)
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedOrders.flatMap((o) => o.materials_used || []).length === 0 ? (
            <p className="text-white/40 col-span-full text-center py-6">
              Nenhum material registrado
            </p>
          ) : (
            Object.entries(
              relatedOrders
                .flatMap((o) => o.materials_used || [])
                .reduce((acc, mat) => {
                  acc[mat.material_name] =
                    (acc[mat.material_name] || 0) + mat.quantity
                  return acc
                }, {})
            ).map(([name, qty]) => (
              <div
                key={name}
                className="p-4 rounded-lg bg-white/[0.02] border border-white/5"
              >
                <p className="text-sm text-white font-medium">{name}</p>
                <p className="text-xs text-white/40 mt-1">
                  {qty} unidades utilizadas
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
