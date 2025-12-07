// @ts-nocheck
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsDao } from '@/api/dao/clients'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { format } from 'date-fns'
import {
  Users,
  Search,
  Plus,
  Phone,
  MapPin,
  Calendar,
  Wrench,
  Star,
  ChevronRight,
  Edit2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function Clients() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [editingClient, setEditingClient] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsDao.list('-created_at', 200),
  })

  const createMutation = useMutation({
    mutationFn: (data) => clientsDao.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients'])
      setIsDialogOpen(false)
      setEditingClient(null)
      alert('Cliente salvo com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao salvar cliente:', error)
      alert(`Erro ao salvar cliente: ${error.message || 'Erro desconhecido'}`)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => clientsDao.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients'])
      setIsDialogOpen(false)
      setEditingClient(null)
      alert('Cliente atualizado com sucesso!')
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar cliente:', error)
      alert(
        `Erro ao atualizar cliente: ${error.message || 'Erro desconhecido'}`
      )
    },
  })

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name?.toLowerCase().includes(search.toLowerCase()) ||
      client.phone?.includes(search) ||
      client.address?.toLowerCase().includes(search.toLowerCase())
    return matchesSearch
  })

  const handleSave = () => {
    if (editingClient?.id) {
      updateMutation.mutate({ id: editingClient.id, data: editingClient })
    } else {
      createMutation.mutate(editingClient)
    }
  }

  const openNewClient = () => {
    setEditingClient({
      name: '',
      phone: '',
      address: '',
      neighborhood: '',
      city: '',
      notes: '',
      total_services: 0,
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Clientes</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Gerencie sua base de clientes
          </p>
        </div>
        <Button
          onClick={openNewClient}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Search */}
      <div className="glass-card rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Buscar por nome, telefone ou endereço..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <Users className="h-10 w-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const isRecurring = (client.total_services || 0) > 2

            return (
              <Link
                key={client.id}
                to={createPageUrl(`ClientDetails?id=${client.id}`)}
                className="glass-card rounded-xl p-5 hover:border-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/20 flex items-center justify-center">
                      <span className="text-cyan-400 font-bold">
                        {client.name?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white">
                          {client.name}
                        </h3>
                        {isRecurring && (
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                        )}
                      </div>
                      <p className="text-xs text-white/40">
                        {client.total_services || 0} serviços
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/40 transition-colors" />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-white/50">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{client.phone}</span>
                  </div>
                  {client.address && (
                    <div className="flex items-start gap-2 text-white/50">
                      <MapPin className="h-3.5 w-3.5 mt-0.5" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                  {client.last_service_date && (
                    <div className="flex items-center gap-2 text-white/50">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Último:{' '}
                        {format(
                          new Date(client.last_service_date),
                          'dd/MM/yyyy'
                        )}
                      </span>
                    </div>
                  )}
                </div>

                {isRecurring && (
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">
                      Cliente Recorrente
                    </Badge>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingClient?.id ? 'Editar Cliente' : 'Novo Cliente'}
            </DialogTitle>
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
                  placeholder="Nome completo"
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
                  placeholder="(00) 00000-0000"
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
                  placeholder="Rua, número"
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
