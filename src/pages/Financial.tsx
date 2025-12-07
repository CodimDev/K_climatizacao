// @ts-nocheck
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { financialDao } from '@/api/dao/financial'
import { serviceOrdersDao } from '@/api/dao/serviceOrders'
import { format, startOfMonth, endOfMonth } from 'date-fns'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Edit2,
  Trash2,
  MoreHorizontal,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  PieChart,
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
import FinanceChart from '@/components/dashboard/FinanceChart'

const categoryLabels = {
  servico: 'Serviço',
  pecas: 'Peças',
  combustivel: 'Combustível',
  ferramentas: 'Ferramentas',
  manutencao: 'Manutenção',
  salario: 'Salário',
  outros: 'Outros',
}

const paymentLabels = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  cartao_credito: 'Cartão Crédito',
  cartao_debito: 'Cartão Débito',
  transferencia: 'Transferência',
}

export default function Financial() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [editingTx, setEditingTx] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const monthStart = format(startOfMonth(new Date()), 'yyyy-MM-dd')
  const monthEnd = format(endOfMonth(new Date()), 'yyyy-MM-dd')

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['financials'],
    queryFn: () => financialDao.list('-date', 200),
  })

  const { data: serviceOrders = [] } = useQuery({
    queryKey: ['service-orders-completed'],
    queryFn: () => serviceOrdersDao.filter({ status: 'concluido' }),
  })

  const createMutation = useMutation({
    mutationFn: (data) => financialDao.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['financials'])
      setIsDialogOpen(false)
      setEditingTx(null)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => financialDao.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['financials'])
      setIsDialogOpen(false)
      setEditingTx(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => financialDao.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['financials']),
  })

  // Calculations
  const monthTx = transactions.filter(
    (t) => t.date >= monthStart && t.date <= monthEnd
  )
  const monthRevenue = monthTx
    .filter((t) => t.type === 'entrada')
    .reduce((sum, t) => sum + (t.amount || 0), 0)
  const monthExpenses = monthTx
    .filter((t) => t.type === 'saida')
    .reduce((sum, t) => sum + (t.amount || 0), 0)
  const balance = monthRevenue - monthExpenses
  const completedServices = serviceOrders.length
  const avgTicket = completedServices > 0 ? monthRevenue / completedServices : 0

  const filteredTx = transactions.filter((tx) => {
    const matchesSearch =
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      categoryLabels[tx.category]?.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilter === 'all' || tx.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleSave = () => {
    if (editingTx?.id) {
      updateMutation.mutate({ id: editingTx.id, data: editingTx })
    } else {
      createMutation.mutate(editingTx)
    }
  }

  const openNewTx = (type) => {
    setEditingTx({
      type,
      category: 'servico',
      description: '',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      payment_method: 'pix',
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Financeiro</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Controle de entradas e saídas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => openNewTx('entrada')}
            className="bg-emerald-500 hover:bg-emerald-400 text-black font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Entrada
          </Button>
          <Button
            onClick={() => openNewTx('saida')}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <Plus className="h-4 w-4 mr-2" />
            Saída
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard
          title="Receita do Mês"
          value={`R$ ${(monthRevenue / 1000).toFixed(1)}k`}
          icon={TrendingUp}
          color="green"
        />
        <KPICard
          title="Despesas do Mês"
          value={`R$ ${(monthExpenses / 1000).toFixed(1)}k`}
          icon={TrendingDown}
          color="red"
        />
        <KPICard
          title="Lucro Líquido"
          value={`R$ ${(balance / 1000).toFixed(1)}k`}
          icon={Wallet}
          color={balance >= 0 ? 'green' : 'red'}
        />
        <KPICard
          title="Serviços Concluídos"
          value={completedServices}
          icon={DollarSign}
          color="cyan"
        />
        <KPICard
          title="Ticket Médio"
          value={`R$ ${avgTicket.toFixed(0)}`}
          icon={PieChart}
          color="purple"
        />
      </div>

      {/* Chart */}
      <FinanceChart />

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Buscar lançamento..."
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
              <SelectItem value="entrada">Entradas</SelectItem>
              <SelectItem value="saida">Saídas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions List */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="divide-y divide-white/5">
          {isLoading ? (
            <div className="p-10 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto" />
            </div>
          ) : filteredTx.length === 0 ? (
            <div className="p-10 text-center">
              <DollarSign className="h-10 w-10 text-white/20 mx-auto mb-3" />
              <p className="text-white/40">Nenhum lançamento encontrado</p>
            </div>
          ) : (
            filteredTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      tx.type === 'entrada'
                        ? 'bg-emerald-500/10'
                        : 'bg-red-500/10'
                    }`}
                  >
                    {tx.type === 'entrada' ? (
                      <ArrowUpCircle className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">
                      {tx.description || categoryLabels[tx.category]}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span>
                        {tx.date
                          ? format(new Date(tx.date), 'dd/MM/yyyy')
                          : '-'}
                      </span>
                      <span>•</span>
                      <span>{paymentLabels[tx.payment_method] || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p
                    className={`font-semibold ${
                      tx.type === 'entrada'
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {tx.type === 'entrada' ? '+' : '-'} R${' '}
                    {tx.amount?.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </p>
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
                          setEditingTx(tx)
                          setIsDialogOpen(true)
                        }}
                        className="text-white hover:bg-white/5"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => deleteMutation.mutate(tx.id)}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>
              {editingTx?.id
                ? 'Editar Lançamento'
                : editingTx?.type === 'entrada'
                  ? 'Nova Entrada'
                  : 'Nova Saída'}
            </DialogTitle>
          </DialogHeader>

          {editingTx && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/60">Data</Label>
                  <Input
                    type="date"
                    value={editingTx.date}
                    onChange={(e) =>
                      setEditingTx({ ...editingTx, date: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label className="text-white/60">Valor (R$)</Label>
                  <Input
                    type="number"
                    value={editingTx.amount}
                    onChange={(e) =>
                      setEditingTx({
                        ...editingTx,
                        amount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white/60">Categoria</Label>
                <Select
                  value={editingTx.category}
                  onValueChange={(value) =>
                    setEditingTx({ ...editingTx, category: value })
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

              <div>
                <Label className="text-white/60">Descrição</Label>
                <Textarea
                  value={editingTx.description || ''}
                  onChange={(e) =>
                    setEditingTx({ ...editingTx, description: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div>
                <Label className="text-white/60">Forma de Pagamento</Label>
                <Select
                  value={editingTx.payment_method}
                  onValueChange={(value) =>
                    setEditingTx({ ...editingTx, payment_method: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    {Object.entries(paymentLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  className={
                    editingTx.type === 'entrada'
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                      : 'bg-red-500 hover:bg-red-400 text-white'
                  }
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
