import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { base44 } from '@/api/base44Client'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { format } from 'date-fns'
import {
  AirVent,
  Search,
  Plus,
  User,
  Calendar,
  Wrench,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const typeLabels = {
  split: 'Split',
  janela: 'Janela',
  cassete: 'Cassete',
  piso_teto: 'Piso Teto',
  multi_split: 'Multi Split',
  central: 'Central',
}

export default function Equipments() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const { data: equipments = [], isLoading } = useQuery({
    queryKey: ['equipments'],
    queryFn: () => base44.entities.Equipment.list(),
  })

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => base44.entities.Client.list(),
  })

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId)
    return client?.name || '-'
  }

  const filteredEquipments = equipments.filter((eq) => {
    const matchesSearch =
      eq.brand?.toLowerCase().includes(search.toLowerCase()) ||
      eq.model?.toLowerCase().includes(search.toLowerCase()) ||
      getClientName(eq.client_id).toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || eq.type === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Equipamentos</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Todos os equipamentos cadastrados
          </p>
        </div>
        <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium">
          <Plus className="h-4 w-4 mr-2" />
          Novo Equipamento
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Buscar por marca, modelo ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">Todos</SelectItem>
              {Object.entries(typeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs font-medium text-white/40">
                  Cliente
                </th>
                <th className="text-left p-4 text-xs font-medium text-white/40">
                  Tipo
                </th>
                <th className="text-left p-4 text-xs font-medium text-white/40">
                  Marca
                </th>
                <th className="text-left p-4 text-xs font-medium text-white/40">
                  Modelo
                </th>
                <th className="text-left p-4 text-xs font-medium text-white/40">
                  BTUs
                </th>
                <th className="text-left p-4 text-xs font-medium text-white/40">
                  Instalação
                </th>
                <th className="text-left p-4 text-xs font-medium text-white/40">
                  Última Manut.
                </th>
                <th className="text-left p-4 text-xs font-medium text-white/40"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
                  </td>
                </tr>
              ) : filteredEquipments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-10 text-center">
                    <AirVent className="h-10 w-10 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">
                      Nenhum equipamento encontrado
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEquipments.map((eq) => (
                  <tr
                    key={eq.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 text-[10px] font-bold">
                          {getClientName(eq.client_id)?.[0]}
                        </div>
                        <span className="text-sm text-white">
                          {getClientName(eq.client_id)}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className="bg-white/5 text-white/60 border-white/10 text-[10px]">
                        {typeLabels[eq.type] || eq.type}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-white/70">{eq.brand}</td>
                    <td className="p-4 text-sm text-white/70">
                      {eq.model || '-'}
                    </td>
                    <td className="p-4 text-sm text-cyan-400 font-medium">
                      {eq.capacity}
                    </td>
                    <td className="p-4 text-sm text-white/50">
                      {eq.installation_date
                        ? format(new Date(eq.installation_date), 'dd/MM/yyyy')
                        : '-'}
                    </td>
                    <td className="p-4 text-sm text-white/50">
                      {eq.last_maintenance
                        ? format(new Date(eq.last_maintenance), 'dd/MM/yyyy')
                        : '-'}
                    </td>
                    <td className="p-4">
                      <Link to={createPageUrl(`EquipmentDetails?id=${eq.id}`)}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white/30 hover:text-white hover:bg-white/5"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
