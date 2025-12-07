// @ts-nocheck
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceOrdersDao } from '@/api/dao/serviceOrders'
import { servicesDao } from '@/api/dao/services'
import { clientsDao } from '@/api/dao/clients'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { format } from 'date-fns'
import {
  ClipboardList,
  Search,
  Plus,
  Filter,
  ChevronRight,
  Clock,
  User,
  Wrench,
  MessageCircle,
  Calendar,
  Phone,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import StatusBadge from '@/components/ui/StatusBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'

export default function ServiceOrders() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState(null)

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['service-orders'],
    queryFn: () => serviceOrdersDao.list('-created_at', 200),
  })

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => servicesDao.list(),
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsDao.list(),
  })

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const orderNumber = `OS-${Date.now().toString().slice(-6)}`
      return serviceOrdersDao.create({
        ...data,
        order_number: orderNumber,
        opened_at: new Date().toISOString(),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['service-orders'])
      setIsDialogOpen(false)
      setNewOrder(null)
      alert('Ordem de serviço criada com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao criar OS:', error)
      alert(`Erro ao criar OS: ${error.message || 'Erro desconhecido'}`)
    },
  })

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(search.toLowerCase()) ||
      order.service_name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const openNewOrder = () => {
    setNewOrder({
      client_name: '',
      client_phone: '',
      client_address: '',
      service_type: 'preventiva',
      service_name: '',
      description: '',
      equipment_type: 'split',
      equipment_brand: '',
      equipment_capacity: '',
      scheduled_date: format(new Date(), 'yyyy-MM-dd'),
      scheduled_time: '08:00',
      priority: 'normal',
      origin: 'manual',
      technician: 'Técnico Principal',
      sla_hours: 24,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    createMutation.mutate(newOrder)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Ordens de Serviço</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Gerencie todas as ordens de serviço
          </p>
        </div>
        <Button
          onClick={openNewOrder}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova OS
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Buscar por cliente, número ou serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="em_execucao">Em Execução</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <ClipboardList className="h-10 w-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Nenhuma ordem de serviço encontrada</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Link
              key={order.id}
              to={createPageUrl(`ServiceOrderDetails?id=${order.id}`)}
              className="block glass-card rounded-xl p-5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  {/* Order number badge */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/20 flex flex-col items-center justify-center">
                      <span className="text-[10px] text-cyan-400/60">OS</span>
                      <span className="text-xs font-bold text-cyan-400">
                        {order.order_number?.slice(-4)}
                      </span>
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {order.client_name}
                      </h3>
                      {order.origin === 'whatsapp' && (
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-white/40 mb-3">
                      <span className="flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        {order.service_name || order.service_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {order.scheduled_date
                          ? format(new Date(order.scheduled_date), 'dd/MM/yyyy')
                          : '-'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {order.scheduled_time}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <StatusBadge status={order.status} />
                      <PriorityBadge priority={order.priority} />
                    </div>
                  </div>
                </div>

                <ChevronRight className="h-5 w-5 text-white/20 group-hover:text-white/40 transition-colors flex-shrink-0" />
              </div>
            </Link>
          ))
        )}
      </div>

      {/* New Order Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-[#1A1A1A] border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Ordem de Serviço</DialogTitle>
          </DialogHeader>

          {newOrder && (
            <div className="space-y-6 pt-4">
              {/* Client info */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dados do Cliente
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60">Nome</Label>
                    <Input
                      value={newOrder.client_name}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          client_name: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="Nome do cliente"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60">Telefone</Label>
                    <Input
                      value={newOrder.client_phone}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          client_phone: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white/60">Endereço</Label>
                  <Input
                    value={newOrder.client_address}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        client_address: e.target.value,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Endereço completo"
                  />
                </div>
              </div>

              {/* Service info */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Dados do Serviço
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white/60">Tipo de Serviço</Label>
                    <Select
                      value={newOrder.service_type}
                      onValueChange={(value) =>
                        setNewOrder({ ...newOrder, service_type: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="preventiva">Preventiva</SelectItem>
                        <SelectItem value="corretiva">Corretiva</SelectItem>
                        <SelectItem value="instalacao">Instalação</SelectItem>
                        <SelectItem value="higienizacao">
                          Higienização
                        </SelectItem>
                        <SelectItem value="desinstalacao">
                          Desinstalação
                        </SelectItem>
                        <SelectItem value="carga_gas">Carga de Gás</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-white/60">Serviço</Label>
                    <Select
                      value={newOrder.service_name}
                      onValueChange={(value) => {
                        const service = services.find((s) => s.name === value)
                        setNewOrder({
                          ...newOrder,
                          service_name: value,
                          service_price: service?.price,
                        })
                      }}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.name}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-white/60">Descrição Técnica</Label>
                  <Textarea
                    value={newOrder.description}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, description: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Descreva o problema ou serviço..."
                  />
                </div>
              </div>

              {/* Equipment info */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white/60">
                  Equipamento
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white/60">Tipo</Label>
                    <Select
                      value={newOrder.equipment_type}
                      onValueChange={(value) =>
                        setNewOrder({ ...newOrder, equipment_type: value })
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
                  <div>
                    <Label className="text-white/60">Marca</Label>
                    <Input
                      value={newOrder.equipment_brand}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          equipment_brand: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60">Capacidade (BTUs)</Label>
                    <Input
                      value={newOrder.equipment_capacity}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          equipment_capacity: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-white/60 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Agendamento
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white/60">Data</Label>
                    <Input
                      type="date"
                      value={newOrder.scheduled_date}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          scheduled_date: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60">Horário</Label>
                    <Input
                      type="time"
                      value={newOrder.scheduled_time}
                      onChange={(e) =>
                        setNewOrder({
                          ...newOrder,
                          scheduled_time: e.target.value,
                        })
                      }
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white/60">Prioridade</Label>
                    <Select
                      value={newOrder.priority}
                      onValueChange={(value) =>
                        setNewOrder({ ...newOrder, priority: value })
                      }
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1A1A1A] border-white/10">
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-white/5">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black"
                >
                  Criar Ordem
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
