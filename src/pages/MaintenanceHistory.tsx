// @ts-nocheck
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '@/api/base44Client'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import {
  History,
  Search,
  Filter,
  Calendar,
  User,
  Wrench,
  Package,
  Clock,
  ChevronRight,
  AirVent,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StatusBadge from '@/components/ui/StatusBadge'

export default function MaintenanceHistory() {
  const [search, setSearch] = useState('')
  const [technicianFilter, setTechnicianFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')

  const { data: orders = [] } = useQuery({
    queryKey: ['service-orders-history'],
    queryFn: () => base44.entities.ServiceOrder.list('-created_date', 500),
  })

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(search.toLowerCase())
    const matchesTechnician =
      technicianFilter === 'all' || order.technician === technicianFilter
    const matchesType =
      typeFilter === 'all' || order.service_type === typeFilter
    const matchesDateStart = !dateStart || order.scheduled_date >= dateStart
    const matchesDateEnd = !dateEnd || order.scheduled_date <= dateEnd
    return (
      matchesSearch &&
      matchesTechnician &&
      matchesType &&
      matchesDateStart &&
      matchesDateEnd
    )
  })

  const technicians = [
    ...new Set(orders.map((o) => o.technician).filter(Boolean)),
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">
          Histórico de Manutenção
        </h1>
        <p className="text-white/40 text-sm mt-0.5">
          Timeline completa de todas as ordens
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Buscar por cliente ou OS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <Select value={technicianFilter} onValueChange={setTechnicianFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Técnico" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">Todos Técnicos</SelectItem>
              {technicians.map((tech) => (
                <SelectItem key={tech} value={tech}>
                  {tech}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">Todos Tipos</SelectItem>
              <SelectItem value="preventiva">Preventiva</SelectItem>
              <SelectItem value="corretiva">Corretiva</SelectItem>
              <SelectItem value="instalacao">Instalação</SelectItem>
              <SelectItem value="higienizacao">Higienização</SelectItem>
              <SelectItem value="carga_gas">Carga de Gás</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="De"
            />
            <Input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Até"
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <History className="h-10 w-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Nenhum registro encontrado</p>
          </div>
        ) : (
          filteredOrders.map((order, index) => (
            <Link
              key={order.id}
              to={createPageUrl(`ServiceOrderDetails?id=${order.id}`)}
              className="block"
            >
              <div className="flex gap-4 group">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      order.status === 'concluido'
                        ? 'bg-emerald-500/20 border border-emerald-500/30'
                        : order.status === 'em_execucao'
                        ? 'bg-amber-500/20 border border-amber-500/30'
                        : 'bg-cyan-500/20 border border-cyan-500/30'
                    }`}
                  >
                    <Wrench
                      className={`h-4 w-4 ${
                        order.status === 'concluido'
                          ? 'text-emerald-400'
                          : order.status === 'em_execucao'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    />
                  </div>
                  {index < filteredOrders.length - 1 && (
                    <div className="w-0.5 flex-1 bg-white/10 my-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 glass-card rounded-xl p-5 hover:border-white/10 transition-all mb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-cyan-400">
                          {order.order_number}
                        </span>
                        <StatusBadge status={order.status} size="xs" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">
                        {order.client_name}
                      </h3>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-white/40">
                        <div className="flex items-center gap-2">
                          <AirVent className="h-3.5 w-3.5" />
                          <span>
                            {order.equipment_type?.replace('_', ' ')}{' '}
                            {order.equipment_brand}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Wrench className="h-3.5 w-3.5" />
                          <span className="capitalize">
                            {order.service_type?.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5" />
                          <span>{order.technician || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {order.scheduled_date
                              ? format(
                                  new Date(order.scheduled_date),
                                  'dd/MM/yyyy'
                                )
                              : '-'}
                          </span>
                        </div>
                      </div>

                      {order.materials_used?.length > 0 && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-white/40">
                          <Package className="h-3.5 w-3.5" />
                          <span>
                            {order.materials_used
                              .map((m) => `${m.material_name} (${m.quantity})`)
                              .join(', ')}
                          </span>
                        </div>
                      )}

                      {order.started_at && order.completed_at && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {format(new Date(order.started_at), 'HH:mm')} -{' '}
                            {format(new Date(order.completed_at), 'HH:mm')}
                          </span>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
