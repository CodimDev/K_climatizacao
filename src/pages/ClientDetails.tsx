// @ts-nocheck
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { base44 } from '@/api/base44Client'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Wrench,
  Edit2,
  Clock,
  Star,
  AirVent,
  Plus,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import StatusBadge from '@/components/ui/StatusBadge'

export default function ClientDetails() {
  const queryClient = useQueryClient()
  const urlParams = new URLSearchParams(window.location.search)
  const clientId = urlParams.get('id')

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [isEquipmentDialogOpen, setIsEquipmentDialogOpen] = useState(false)
  const [newEquipment, setNewEquipment] = useState(null)

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: async () => {
      const clients = await base44.entities.Client.filter({ id: clientId })
      return clients[0]
    },
    enabled: !!clientId,
  })

  const { data: serviceOrders = [] } = useQuery({
    queryKey: ['client-orders', clientId],
    queryFn: () =>
      base44.entities.ServiceOrder.filter(
        { client_id: clientId },
        '-created_date'
      ),
    enabled: !!clientId,
  })

  const { data: equipments = [] } = useQuery({
    queryKey: ['client-equipments', clientId],
    queryFn: () => base44.entities.Equipment.filter({ client_id: clientId }),
    enabled: !!clientId,
  })

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Client.update(clientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['client', clientId])
      setIsEditDialogOpen(false)
    },
  })

  const createEquipmentMutation = useMutation({
    mutationFn: (data) =>
      base44.entities.Equipment.create({ ...data, client_id: clientId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['client-equipments', clientId])
      setIsEquipmentDialogOpen(false)
      setNewEquipment(null)
    },
  })

  const completedOrders = serviceOrders.filter((o) => o.status === 'concluido')
  const upcomingOrders = serviceOrders.filter(
    (o) => o.status !== 'concluido' && o.status !== 'cancelado'
  )
  const isRecurring = (client?.total_services || 0) > 2

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="text-center py-10">
        <p className="text-white/40">Cliente não encontrado</p>
        <Link to={createPageUrl('Clients')}>
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
        <Link to={createPageUrl('Clients')}>
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
            <h1 className="text-xl font-bold text-white">{client.name}</h1>
            {isRecurring && (
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            )}
          </div>
          <p className="text-white/40 text-sm">
            {client.total_services || 0} serviços realizados
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setEditingClient(client)
            setIsEditDialogOpen(true)
          }}
          className="border-white/10 text-white hover:bg-white/5"
        >
          <Edit2 className="h-4 w-4 mr-2" />
          Editar
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/20 flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-2xl">
                  {client.name?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-bold text-white text-lg">{client.name}</h2>
                {isRecurring && (
                  <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 mt-1">
                    Cliente Recorrente
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center gap-3 text-white/70">
                <Phone className="h-4 w-4 text-white/40" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="h-4 w-4 text-white/40 mt-0.5" />
                <div>
                  <p>{client.address}</p>
                  {client.neighborhood && (
                    <p className="text-sm text-white/50">
                      {client.neighborhood}
                    </p>
                  )}
                  {client.city && (
                    <p className="text-sm text-white/50">{client.city}</p>
                  )}
                </div>
              </div>
              {client.last_service_date && (
                <div className="flex items-center gap-3 text-white/70">
                  <Calendar className="h-4 w-4 text-white/40" />
                  <span>
                    Último:{' '}
                    {format(new Date(client.last_service_date), 'dd/MM/yyyy')}
                  </span>
                </div>
              )}
            </div>

            {client.notes && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-white/40 mb-2">Observações</p>
                <p className="text-white/70 text-sm">{client.notes}</p>
              </div>
            )}
          </div>

          {/* Equipments */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
                <AirVent className="h-4 w-4" />
                Equipamentos
              </h3>
              <Button
                size="sm"
                onClick={() => {
                  setNewEquipment({
                    type: 'split',
                    brand: '',
                    model: '',
                    capacity: '',
                    serial_number: '',
                    location: '',
                  })
                  setIsEquipmentDialogOpen(true)
                }}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Adicionar
              </Button>
            </div>

            {equipments.length === 0 ? (
              <div className="text-center py-6">
                <AirVent className="h-8 w-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">Nenhum equipamento</p>
              </div>
            ) : (
              <div className="space-y-3">
                {equipments.map((eq) => (
                  <div
                    key={eq.id}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white text-sm capitalize">
                        {eq.type?.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-white/40">
                        {eq.capacity} BTUs
                      </span>
                    </div>
                    <p className="text-xs text-white/50">
                      {eq.brand} {eq.model}
                    </p>
                    {eq.location && (
                      <p className="text-xs text-white/30 mt-1">
                        📍 {eq.location}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Serviços Agendados
            </h3>
            {upcomingOrders.length === 0 ? (
              <p className="text-white/40 text-center py-6">
                Nenhum serviço agendado
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={createPageUrl(`ServiceOrderDetails?id=${order.id}`)}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {order.service_name || order.service_type}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <span>
                            {order.scheduled_date
                              ? format(
                                  new Date(order.scheduled_date),
                                  'dd/MM/yyyy'
                                )
                              : '-'}
                          </span>
                          <span>•</span>
                          <span>{order.scheduled_time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} size="xs" />
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Histórico de Serviços
            </h3>
            {completedOrders.length === 0 ? (
              <p className="text-white/40 text-center py-6">
                Nenhum serviço realizado
              </p>
            ) : (
              <div className="space-y-3">
                {completedOrders.map((order) => (
                  <Link
                    key={order.id}
                    to={createPageUrl(`ServiceOrderDetails?id=${order.id}`)}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <Wrench className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {order.service_name || order.service_type}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-white/40">
                          <span>
                            {order.scheduled_date
                              ? format(
                                  new Date(order.scheduled_date),
                                  'dd/MM/yyyy'
                                )
                              : '-'}
                          </span>
                          {order.service_price && (
                            <>
                              <span>•</span>
                              <span>
                                R${' '}
                                {order.service_price?.toLocaleString('pt-BR')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} size="xs" />
                      <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          {editingClient && (
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-white/60">Nome</Label>
                <Input
                  value={editingClient.name}
                  onChange={(e) =>
                    setEditingClient({ ...editingClient, name: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white/60">Telefone</Label>
                <Input
                  value={editingClient.phone}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      phone: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white/60">Endereço</Label>
                <Input
                  value={editingClient.address || ''}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      address: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Bairro</Label>
                  <Input
                    value={editingClient.neighborhood || ''}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        neighborhood: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/60">Cidade</Label>
                  <Input
                    value={editingClient.city || ''}
                    onChange={(e) =>
                      setEditingClient({
                        ...editingClient,
                        city: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-white/60">Observações</Label>
                <Textarea
                  value={editingClient.notes || ''}
                  onChange={(e) =>
                    setEditingClient({
                      ...editingClient,
                      notes: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => updateMutation.mutate(editingClient)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black"
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Equipment Dialog */}
      <Dialog
        open={isEquipmentDialogOpen}
        onOpenChange={setIsEquipmentDialogOpen}
      >
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Adicionar Equipamento</DialogTitle>
          </DialogHeader>
          {newEquipment && (
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-white/60">Tipo</Label>
                <Select
                  value={newEquipment.type}
                  onValueChange={(value) =>
                    setNewEquipment({ ...newEquipment, type: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    <SelectItem value="split">Split</SelectItem>
                    <SelectItem value="janela">Janela</SelectItem>
                    <SelectItem value="cassete">Cassete</SelectItem>
                    <SelectItem value="piso_teto">Piso Teto</SelectItem>
                    <SelectItem value="multi_split">Multi Split</SelectItem>
                    <SelectItem value="central">Central</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Marca</Label>
                  <Input
                    value={newEquipment.brand}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        brand: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/60">Capacidade (BTUs)</Label>
                  <Input
                    value={newEquipment.capacity}
                    onChange={(e) =>
                      setNewEquipment({
                        ...newEquipment,
                        capacity: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-white/60">
                  Local (ex: Sala, Quarto)
                </Label>
                <Input
                  value={newEquipment.location}
                  onChange={(e) =>
                    setNewEquipment({
                      ...newEquipment,
                      location: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEquipmentDialogOpen(false)}
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => createEquipmentMutation.mutate(newEquipment)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black"
                >
                  Adicionar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
