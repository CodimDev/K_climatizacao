// @ts-nocheck
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { stockDao } from '@/api/dao/stock'
import { stockMovementsDao } from '@/api/dao/stockMovements'
import { format } from 'date-fns'
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  Minus,
  TrendingDown,
  History,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import KPICard from '@/components/ui/KPICard'

const categoryLabels = {
  gas: 'Gás',
  pecas: 'Peças',
  ferramentas: 'Ferramentas',
  consumiveis: 'Consumíveis',
  eletricos: 'Elétricos',
  outros: 'Outros',
}

const unitLabels = {
  un: 'Unidade',
  m: 'Metro',
  kg: 'Kg',
  l: 'Litro',
  rolo: 'Rolo',
  cx: 'Caixa',
}

export default function Stock() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editingItem, setEditingItem] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [adjustItem, setAdjustItem] = useState(null)
  const [adjustAmount, setAdjustAmount] = useState(0)
  const [showMovements, setShowMovements] = useState(null)

  const { data: stockItems = [], isLoading } = useQuery({
    queryKey: ['stocks'],
    queryFn: () => stockDao.list('name'),
  })

  const { data: movements = [] } = useQuery({
    queryKey: ['stock-movements'],
    queryFn: () => stockMovementsDao.list('-created_date', 100),
  })

  const createMutation = useMutation({
    mutationFn: (data) => stockDao.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['stocks'])
      setIsDialogOpen(false)
      setEditingItem(null)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => stockDao.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['stocks'])
      setIsDialogOpen(false)
      setEditingItem(null)
      setAdjustItem(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => stockDao.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['stocks']),
  })

  const movementMutation = useMutation({
    mutationFn: (data) => stockMovementsDao.create(data),
    onSuccess: () => queryClient.invalidateQueries(['stock-movements']),
  })

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(search.toLowerCase())
    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const lowStockCount = stockItems.filter(
    (item) => item.quantity <= item.min_quantity
  ).length
  const zeroStockCount = stockItems.filter((item) => item.quantity === 0).length
  const totalItems = stockItems.length

  const handleSave = () => {
    if (editingItem?.id) {
      updateMutation.mutate({ id: editingItem.id, data: editingItem })
    } else {
      createMutation.mutate(editingItem)
    }
  }

  const handleAdjust = () => {
    if (!adjustItem) return
    const newQty = Math.max(0, adjustItem.quantity + adjustAmount)
    updateMutation.mutate({ id: adjustItem.id, data: { quantity: newQty } })
    movementMutation.mutate({
      stock_id: adjustItem.id,
      material_name: adjustItem.name,
      type: adjustAmount > 0 ? 'entrada' : 'saida',
      quantity: Math.abs(adjustAmount),
      reason: 'Ajuste manual',
    })
    setAdjustAmount(0)
  }

  const getStockStatus = (item) => {
    if (item.quantity === 0) {
      return {
        label: 'Zerado',
        color: 'bg-red-500/10 text-red-400 border-red-500/20',
      }
    }
    if (item.quantity <= item.min_quantity) {
      return {
        label: 'Baixo',
        color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      }
    }
    return {
      label: 'OK',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    }
  }

  const openNewItem = () => {
    setEditingItem({
      name: '',
      category: 'pecas',
      quantity: 0,
      unit: 'un',
      min_quantity: 1,
      notes: '',
    })
    setIsDialogOpen(true)
  }

  const itemMovements = showMovements
    ? movements.filter((m) => m.stock_id === showMovements.id)
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Estoque</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Controle de materiais e insumos
          </p>
        </div>
        <Button
          onClick={openNewItem}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Material
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <KPICard
          title="Total de Itens"
          value={totalItems}
          icon={Package}
          color="cyan"
        />
        <KPICard
          title="Estoque Baixo"
          value={lowStockCount}
          icon={TrendingDown}
          color="amber"
        />
        <KPICard
          title="Zerados"
          value={zeroStockCount}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Alert */}
      {lowStockCount > 0 && (
        <div className="glass-card rounded-xl p-4 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="font-medium text-amber-400">
                Atenção: Estoque Baixo
              </p>
              <p className="text-sm text-white/50">
                {lowStockCount} itens precisam de reposição
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Buscar material..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">Todas</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stock Grid */}
      {isLoading ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <Package className="h-10 w-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/40">Nenhum material cadastrado</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const status = getStockStatus(item)
            const percentage =
              item.min_quantity > 0
                ? (item.quantity / item.min_quantity) * 100
                : 100

            return (
              <div key={item.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Package className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        {item.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="text-[10px] text-white/50 border-white/10 mt-1"
                      >
                        {categoryLabels[item.category]}
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
                          setAdjustItem(item)
                          setAdjustAmount(0)
                        }}
                        className="text-white hover:bg-white/5"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Ajustar Qtd
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setShowMovements(item)}
                        className="text-white hover:bg-white/5"
                      >
                        <History className="h-4 w-4 mr-2" />
                        Movimentações
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingItem(item)
                          setIsDialogOpen(true)
                        }}
                        className="text-white hover:bg-white/5"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteMutation.mutate(item.id)}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-end justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {item.quantity}
                    </p>
                    <p className="text-xs text-white/40">
                      {unitLabels[item.unit]} • Mín: {item.min_quantity}
                    </p>
                  </div>
                  <Badge className={`${status.color} border text-[10px]`}>
                    {status.label}
                  </Badge>
                </div>

                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      percentage > 100
                        ? 'bg-emerald-500'
                        : percentage > 50
                          ? 'bg-cyan-500'
                          : percentage > 0
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? 'Editar Material' : 'Novo Material'}
            </DialogTitle>
          </DialogHeader>

          {editingItem && (
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-white/60">Nome</Label>
                <Input
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white/60">Categoria</Label>
                <Select
                  value={editingItem.category}
                  onValueChange={(value) =>
                    setEditingItem({ ...editingItem, category: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-white/60">Qtd</Label>
                  <Input
                    type="number"
                    value={editingItem.quantity}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/60">Unidade</Label>
                  <Select
                    value={editingItem.unit}
                    onValueChange={(value) =>
                      setEditingItem({ ...editingItem, unit: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-white/10">
                      {Object.entries(unitLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white/60">Mínimo</Label>
                  <Input
                    type="number"
                    value={editingItem.min_quantity}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        min_quantity: parseInt(e.target.value) || 1,
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

      {/* Adjust Dialog */}
      <Dialog
        open={!!adjustItem}
        onOpenChange={(open) => !open && setAdjustItem(null)}
      >
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle>Ajustar Quantidade</DialogTitle>
          </DialogHeader>
          {adjustItem && (
            <div className="space-y-4 pt-4">
              <div className="text-center p-4 bg-white/[0.02] rounded-lg">
                <p className="text-sm text-white/50 mb-1">{adjustItem.name}</p>
                <p className="text-3xl font-bold text-white">
                  {adjustItem.quantity} {adjustItem.unit}
                </p>
              </div>
              <div>
                <Label className="text-white/60">Ajuste (+/-)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdjustAmount((prev) => prev - 1)}
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) =>
                      setAdjustAmount(parseInt(e.target.value) || 0)
                    }
                    className="text-center bg-white/5 border-white/10 text-white"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setAdjustAmount((prev) => prev + 1)}
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-center p-3 bg-cyan-500/5 border border-cyan-500/10 rounded-lg">
                <p className="text-xs text-cyan-400">Nova quantidade:</p>
                <p className="text-xl font-bold text-cyan-400">
                  {Math.max(0, adjustItem.quantity + adjustAmount)}{' '}
                  {adjustItem.unit}
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setAdjustItem(null)}
                  className="border-white/10 text-white hover:bg-white/5"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleAdjust}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Movements Dialog */}
      <Dialog
        open={!!showMovements}
        onOpenChange={(open) => !open && setShowMovements(null)}
      >
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Movimentações - {showMovements?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {itemMovements.length === 0 ? (
              <p className="text-white/40 text-center py-6">
                Nenhuma movimentação registrada
              </p>
            ) : (
              itemMovements.map((mov) => (
                <div
                  key={mov.id}
                  className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        mov.type === 'entrada'
                          ? 'bg-emerald-500/10'
                          : 'bg-red-500/10'
                      }`}
                    >
                      {mov.type === 'entrada' ? (
                        <Plus className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Minus className="h-4 w-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white">{mov.reason || '-'}</p>
                      <p className="text-xs text-white/40">
                        {mov.created_date
                          ? format(
                              new Date(mov.created_date),
                              'dd/MM/yyyy HH:mm'
                            )
                          : '-'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold ${
                      mov.type === 'entrada'
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {mov.type === 'entrada' ? '+' : '-'}
                    {mov.quantity}
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
