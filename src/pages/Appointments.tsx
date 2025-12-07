// @ts-nocheck
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { base44 } from '@/api/base44Client'
import { format } from 'date-fns'
import {
  Calendar,
  Search,
  Plus,
  Clock,
  User,
  Wrench,
  MessageCircle,
  ChevronRight,
  Phone,
  MapPin,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Edit2,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import StatusBadge from '@/components/ui/StatusBadge'

export default function Appointments() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [editingApt, setEditingApt] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => base44.entities.Appointment.list('-date', 200),
  })

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list(),
  })

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Appointment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments'])
      setIsDialogOpen(false)
      setEditingApt(null)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Appointment.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments'])
      setIsDialogOpen(false)
      setEditingApt(null)
    },
  })

  const filteredApts = appointments.filter((apt) => {
    const matchesSearch =
      apt.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      apt.client_phone?.includes(search) ||
      apt.service_name?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter
    const matchesDate = !dateFilter || apt.date === dateFilter
    return matchesSearch && matchesStatus && matchesDate
  })

  const handleStatusChange = (apt, newStatus) => {
    updateMutation.mutate({ id: apt.id, data: { status: newStatus } })
  }

  const handleSave = () => {
    if (editingApt?.id) {
      updateMutation.mutate({ id: editingApt.id, data: editingApt })
    } else {
      createMutation.mutate({ ...editingApt, origin: 'manual' })
    }
  }

  const openNewApt = () => {
    setEditingApt({
      client_name: '',
      client_phone: '',
      client_address: '',
      service_name: '',
      service_price: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '08:00',
      status: 'pendente',
      origin: 'manual',
      notes: '',
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Agendamentos</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Gerencie os agendamentos
          </p>
        </div>
        <Button
          onClick={openNewApt}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Buscar por cliente, telefone ou serviço..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-40 bg-white/5 border-white/10 text-white"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="confirmado">Confirmado</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
          </div>
        ) : filteredApts.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <Calendar className="h-10 w-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Nenhum agendamento encontrado</p>
          </div>
        ) : (
          filteredApts.map((apt) => (
            <div
              key={apt.id}
              className="glass-card rounded-xl p-5 hover:border-white/10 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  {/* Time */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/20 flex flex-col items-center justify-center">
                      <span className="text-lg font-bold text-cyan-400">
                        {apt.time?.split(':')[0]}
                      </span>
                      <span className="text-[10px] text-cyan-400/60">
                        {apt.time}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {apt.client_name}
                      </h3>
                      {apt.origin === 'whatsapp' && (
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {apt.date
                          ? format(new Date(apt.date), 'dd/MM/yyyy')
                          : '-'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        {apt.service_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {apt.client_phone}
                      </span>
                    </div>

                    {apt.client_address && (
                      <div className="flex items-center gap-1 text-xs text-white/30 mb-3">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{apt.client_address}</span>
                      </div>
                    )}

                    <StatusBadge status={apt.status} />
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white/40 hover:text-white hover:bg-white/5 h-8 w-8"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-[#1A1A1A] border-white/10"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingApt(apt)
                        setIsDialogOpen(true)
                      }}
                      className="text-white hover:bg-white/5"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(apt, 'confirmado')}
                      className="text-cyan-400 hover:bg-cyan-500/10"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Confirmar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(apt, 'concluido')}
                      className="text-emerald-400 hover:bg-emerald-500/10"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Concluir
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(apt, 'cancelado')}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancelar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingApt?.id ? 'Editar Agendamento' : 'Novo Agendamento'}
            </DialogTitle>
          </DialogHeader>

          {editingApt && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Data</Label>
                  <Input
                    type="date"
                    value={editingApt.date}
                    onChange={(e) =>
                      setEditingApt({ ...editingApt, date: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/60">Horário</Label>
                  <Input
                    type="time"
                    value={editingApt.time}
                    onChange={(e) =>
                      setEditingApt({ ...editingApt, time: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white/60">Nome do Cliente</Label>
                <Input
                  value={editingApt.client_name}
                  onChange={(e) =>
                    setEditingApt({
                      ...editingApt,
                      client_name: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white/60">Telefone</Label>
                <Input
                  value={editingApt.client_phone}
                  onChange={(e) =>
                    setEditingApt({
                      ...editingApt,
                      client_phone: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white/60">Endereço</Label>
                <Input
                  value={editingApt.client_address}
                  onChange={(e) =>
                    setEditingApt({
                      ...editingApt,
                      client_address: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white/60">Serviço</Label>
                <Select
                  value={editingApt.service_name}
                  onValueChange={(value) => {
                    const service = services.find((s) => s.name === value)
                    setEditingApt({
                      ...editingApt,
                      service_name: value,
                      service_price: service?.price || 0,
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

              <div>
                <Label className="text-white/60">Status</Label>
                <Select
                  value={editingApt.status}
                  onValueChange={(value) =>
                    setEditingApt({ ...editingApt, status: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white/60">Observações</Label>
                <Textarea
                  value={editingApt.notes || ''}
                  onChange={(e) =>
                    setEditingApt({ ...editingApt, notes: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4">
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
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
