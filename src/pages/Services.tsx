// @ts-nocheck
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { base44 } from '@/api/base44Client'
import {
  Wrench,
  Search,
  Plus,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  MoreHorizontal,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const categoryConfig = {
  instalacao: {
    label: 'Instalação',
    color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  preventiva: {
    label: 'Preventiva',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  corretiva: {
    label: 'Corretiva',
    color: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  higienizacao: {
    label: 'Higienização',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  carga_gas: {
    label: 'Carga de Gás',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  desinstalacao: {
    label: 'Desinstalação',
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  outros: {
    label: 'Outros',
    color: 'bg-white/10 text-white/60 border-white/20',
  },
}

export default function Services() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editingService, setEditingService] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => base44.entities.Service.list('name'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Service.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['services'])
      setIsDialogOpen(false)
      setEditingService(null)
    },
  })

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Service.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['services'])
      setIsDialogOpen(false)
      setEditingService(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Service.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['services']),
  })

  const filteredServices = services.filter(
    (service) =>
      service.name?.toLowerCase().includes(search.toLowerCase()) ||
      service.description?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSave = () => {
    if (editingService?.id) {
      updateMutation.mutate({ id: editingService.id, data: editingService })
    } else {
      createMutation.mutate({ ...editingService, active: true })
    }
  }

  const handleToggleActive = (service) => {
    updateMutation.mutate({ id: service.id, data: { active: !service.active } })
  }

  const openNewService = () => {
    setEditingService({
      name: '',
      description: '',
      price: 0,
      duration: 60,
      category: 'instalacao',
      active: true,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Serviços</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Cadastre os serviços oferecidos
          </p>
        </div>
        <Button
          onClick={openNewService}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Serviço
        </Button>
      </div>

      {/* Search */}
      <div className="glass-card rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Buscar serviço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <Wrench className="h-10 w-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">Nenhum serviço cadastrado</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`glass-card rounded-xl p-5 transition-all ${
                !service.active ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/20 flex items-center justify-center">
                    <Wrench className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">
                      {service.name}
                    </h3>
                    <Badge
                      className={`${
                        categoryConfig[service.category]?.color
                      } border text-[10px] mt-1`}
                    >
                      {categoryConfig[service.category]?.label}
                    </Badge>
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
                        setEditingService(service)
                        setIsDialogOpen(true)
                      }}
                      className="text-white hover:bg-white/5"
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => deleteMutation.mutate(service.id)}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {service.description && (
                <p className="text-white/40 text-xs mb-4 line-clamp-2">
                  {service.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="text-sm font-semibold">
                      R${' '}
                      {service.price?.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-xs">{service.duration} min</span>
                  </div>
                </div>
                <Switch
                  checked={service.active}
                  onCheckedChange={() => handleToggleActive(service)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingService?.id ? 'Editar Serviço' : 'Novo Serviço'}
            </DialogTitle>
          </DialogHeader>

          {editingService && (
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-white/60">Nome do Serviço</Label>
                <Input
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      name: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="Ex: Instalação de Split 12.000 BTUs"
                />
              </div>

              <div>
                <Label className="text-white/60">Descrição</Label>
                <Textarea
                  value={editingService.description || ''}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      description: e.target.value,
                    })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white/60">Categoria</Label>
                <Select
                  value={editingService.category}
                  onValueChange={(value) =>
                    setEditingService({ ...editingService, category: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    {Object.entries(categoryConfig).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Valor (R$)</Label>
                  <Input
                    type="number"
                    value={editingService.price}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/60">Duração (min)</Label>
                  <Input
                    type="number"
                    value={editingService.duration}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        duration: parseInt(e.target.value) || 60,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
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
