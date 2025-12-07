// @ts-nocheck
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { serviceOrdersDao } from '@/api/dao/serviceOrders'
import { stockDao } from '@/api/dao/stock'
import { stockMovementsDao } from '@/api/dao/stockMovements'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  ArrowLeft,
  Play,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Phone,
  MapPin,
  Wrench,
  Package,
  Plus,
  Minus,
  Camera,
  FileText,
  Timer,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import StatusBadge from '@/components/ui/StatusBadge'
import PriorityBadge from '@/components/ui/PriorityBadge'

export default function ServiceOrderDetails() {
  const queryClient = useQueryClient()
  const urlParams = new URLSearchParams(window.location.search)
  const orderId = urlParams.get('id')

  const [showMaterialDialog, setShowMaterialDialog] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState(null)
  const [materialQty, setMaterialQty] = useState(1)
  const [technicalNotes, setTechnicalNotes] = useState('')

  const { data: order, isLoading } = useQuery({
    queryKey: ['service-order', orderId],
    queryFn: async () => {
      const orders = await serviceOrdersDao.filter({ id: orderId })
      return orders[0]
    },
    enabled: !!orderId,
  })

  const { data: stocks = [] } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => stockDao.list(),
  })

  const updateMutation = useMutation({
    mutationFn: (data) => serviceOrdersDao.update(orderId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['service-order', orderId])
    },
  })

  const stockMutation = useMutation({
    mutationFn: async ({ stockId, qty, name }) => {
      const stock = stocks.find((s) => s.id === stockId)
      await stockDao.update(stockId, { quantity: stock.quantity - qty })
      await stockMovementsDao.create({
        stock_id: stockId,
        material_name: name,
        type: 'saida',
        quantity: qty,
        reason: `Usado na OS ${order.order_number}`,
        service_order_id: orderId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['stocks'])
    },
  })

  const handleStartService = () => {
    updateMutation.mutate({
      status: 'em_execucao',
      started_at: new Date().toISOString(),
    })
  }

  const handleCompleteService = () => {
    updateMutation.mutate({
      status: 'concluido',
      completed_at: new Date().toISOString(),
      technical_notes: technicalNotes,
    })
  }

  const handleAddMaterial = () => {
    const stock = stocks.find((s) => s.id === selectedMaterial)
    if (!stock) return

    const currentMaterials = order.materials_used || []
    const existingIndex = currentMaterials.findIndex(
      (m) => m.material_id === selectedMaterial
    )

    let newMaterials
    if (existingIndex >= 0) {
      newMaterials = [...currentMaterials]
      newMaterials[existingIndex].quantity += materialQty
    } else {
      newMaterials = [
        ...currentMaterials,
        {
          material_id: selectedMaterial,
          material_name: stock.name,
          quantity: materialQty,
        },
      ]
    }

    updateMutation.mutate({ materials_used: newMaterials })
    stockMutation.mutate({
      stockId: selectedMaterial,
      qty: materialQty,
      name: stock.name,
    })
    setShowMaterialDialog(false)
    setSelectedMaterial(null)
    setMaterialQty(1)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-white/40">Ordem de serviço não encontrada</p>
        <Link to={createPageUrl('ServiceOrders')}>
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

  const timelineSteps = [
    {
      label: 'Abertura',
      time: order.opened_at,
      icon: FileText,
      done: !!order.opened_at,
    },
    {
      label: 'Início',
      time: order.started_at,
      icon: Play,
      done: !!order.started_at,
    },
    {
      label: 'Conclusão',
      time: order.completed_at,
      icon: CheckCircle,
      done: !!order.completed_at,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={createPageUrl('ServiceOrders')}>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">
              {order.order_number}
            </h1>
            <StatusBadge status={order.status} />
            <PriorityBadge priority={order.priority} />
          </div>
          <p className="text-white/40 text-sm mt-0.5">{order.client_name}</p>
        </div>

        {/* Action buttons */}
        {order.status === 'pendente' || order.status === 'confirmado' ? (
          <Button
            onClick={handleStartService}
            className="bg-cyan-500 hover:bg-cyan-400 text-black"
          >
            <Play className="h-4 w-4 mr-2" />
            Iniciar Atendimento
          </Button>
        ) : order.status === 'em_execucao' ? (
          <Button
            onClick={handleCompleteService}
            className="bg-emerald-500 hover:bg-emerald-400 text-black"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Finalizar Serviço
          </Button>
        ) : null}
      </div>

      {/* Timeline */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-medium text-white/60 mb-4">Timeline</h3>
        <div className="flex items-center justify-between">
          {timelineSteps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                  w-10 h-10 rounded-xl flex items-center justify-center mb-2
                  ${
                    step.done
                      ? 'bg-gradient-to-br from-cyan-500 to-cyan-400 shadow-lg shadow-cyan-500/20'
                      : 'bg-white/5 border border-white/10'
                  }
                `}
                >
                  <step.icon
                    className={`h-5 w-5 ${
                      step.done ? 'text-black' : 'text-white/30'
                    }`}
                  />
                </div>
                <p
                  className={`text-xs font-medium ${
                    step.done ? 'text-white' : 'text-white/30'
                  }`}
                >
                  {step.label}
                </p>
                {step.time && (
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {format(new Date(step.time), 'dd/MM HH:mm')}
                  </p>
                )}
              </div>
              {index < timelineSteps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    step.done ? 'bg-cyan-500/50' : 'bg-white/5'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column - Service & Client info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service info */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Dados do Serviço
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/40 mb-1">Tipo de Serviço</p>
                <p className="text-white font-medium capitalize">
                  {order.service_type?.replace('_', ' ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Serviço</p>
                <p className="text-white font-medium">
                  {order.service_name || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Valor</p>
                <p className="text-white font-medium">
                  R${' '}
                  {order.service_price?.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                  }) || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">SLA Estimado</p>
                <p className="text-white font-medium">
                  {order.sla_hours || 24}h
                </p>
              </div>
            </div>
            {order.description && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-white/40 mb-1">Descrição Técnica</p>
                <p className="text-white/80 text-sm">{order.description}</p>
              </div>
            )}
          </div>

          {/* Equipment info */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4">
              Equipamento
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-white/40 mb-1">Tipo</p>
                <p className="text-white font-medium capitalize">
                  {order.equipment_type?.replace('_', ' ') || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Marca</p>
                <p className="text-white font-medium">
                  {order.equipment_brand || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Capacidade</p>
                <p className="text-white font-medium">
                  {order.equipment_capacity || '-'} BTUs
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Nº Série</p>
                <p className="text-white font-medium">
                  {order.equipment_serial || '-'}
                </p>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white/60 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Materiais Utilizados
              </h3>
              {order.status === 'em_execucao' && (
                <Button
                  size="sm"
                  onClick={() => setShowMaterialDialog(true)}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar
                </Button>
              )}
            </div>

            {!order.materials_used || order.materials_used.length === 0 ? (
              <div className="text-center py-6">
                <Package className="h-8 w-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">
                  Nenhum material registrado
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {order.materials_used.map((mat, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5"
                  >
                    <span className="text-white">{mat.material_name}</span>
                    <span className="text-white/60 text-sm">
                      {mat.quantity} un
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technical notes (for in progress) */}
          {order.status === 'em_execucao' && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-medium text-white/60 mb-4">
                Observações Técnicas
              </h3>
              <Textarea
                value={technicalNotes}
                onChange={(e) => setTechnicalNotes(e.target.value)}
                className="bg-white/5 border-white/10 text-white min-h-[100px]"
                placeholder="Descreva o trabalho realizado, peças trocadas, diagnóstico..."
              />
            </div>
          )}

          {/* Completed notes */}
          {order.status === 'concluido' && order.technical_notes && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-sm font-medium text-white/60 mb-4">
                Observações do Técnico
              </h3>
              <p className="text-white/80 text-sm">{order.technical_notes}</p>
            </div>
          )}
        </div>

        {/* Right column - Client & Schedule */}
        <div className="space-y-6">
          {/* Client */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
              <User className="h-4 w-4" />
              Cliente
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/20 flex items-center justify-center">
                  <span className="text-cyan-400 font-bold">
                    {order.client_name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-white">{order.client_name}</p>
                  <p className="text-xs text-white/40">Cliente</p>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Phone className="h-4 w-4" />
                  {order.client_phone || '-'}
                </div>
                <div className="flex items-start gap-2 text-sm text-white/60">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>{order.client_address || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-sm font-medium text-white/60 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamento
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-white/40 mb-1">Data</p>
                <p className="text-white font-medium">
                  {order.scheduled_date
                    ? format(
                        new Date(order.scheduled_date),
                        "dd 'de' MMMM, yyyy",
                        { locale: ptBR }
                      )
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Horário</p>
                <p className="text-white font-medium">
                  {order.scheduled_time || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1">Técnico</p>
                <p className="text-white font-medium">
                  {order.technician || 'Não atribuído'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Material Dialog */}
      <Dialog open={showMaterialDialog} onOpenChange={setShowMaterialDialog}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Adicionar Material</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label className="text-white/60">Material</Label>
              <Select
                value={selectedMaterial}
                onValueChange={setSelectedMaterial}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Selecione o material" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] border-white/10">
                  {stocks
                    .filter((s) => s.quantity > 0)
                    .map((stock) => (
                      <SelectItem key={stock.id} value={stock.id}>
                        {stock.name} ({stock.quantity} {stock.unit} disponível)
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white/60">Quantidade</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMaterialQty(Math.max(1, materialQty - 1))}
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={materialQty}
                  onChange={(e) =>
                    setMaterialQty(parseInt(e.target.value) || 1)
                  }
                  className="text-center bg-white/5 border-white/10 text-white"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMaterialQty(materialQty + 1)}
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setShowMaterialDialog(false)}
                className="border-white/10 text-white hover:bg-white/5"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddMaterial}
                disabled={!selectedMaterial}
                className="bg-cyan-500 hover:bg-cyan-400 text-black"
              >
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
