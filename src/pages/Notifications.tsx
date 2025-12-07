// @ts-nocheck
import React, { useState } from 'react'
import { format } from 'date-fns'
import {
  Bell,
  Calendar,
  Wrench,
  CheckCircle,
  Package,
  DollarSign,
  Users,
  Filter,
  Trash2,
  CheckCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const mockNotifications = [
  {
    id: 1,
    type: 'appointment',
    title: 'Novo agendamento recebido',
    description: 'Maria Silva agendou Higienização para 20/01 às 08:00',
    time: '2025-01-20T14:30:00',
    read: false,
  },
  {
    id: 2,
    type: 'service_order',
    title: 'OS iniciada',
    description: 'João Técnico iniciou a OS #001236 - Instalação Split',
    time: '2025-01-20T14:00:00',
    read: false,
  },
  {
    id: 3,
    type: 'service_order',
    title: 'OS concluída',
    description: 'OS #001238 finalizada com sucesso',
    time: '2025-01-18T16:30:00',
    read: true,
  },
  {
    id: 4,
    type: 'stock',
    title: 'Estoque baixo',
    description: 'Gás R410A está abaixo do estoque mínimo (2 kg restantes)',
    time: '2025-01-20T10:00:00',
    read: false,
  },
  {
    id: 5,
    type: 'financial',
    title: 'Pagamento recebido',
    description: 'Pagamento de R$ 400,00 registrado - Ana Costa',
    time: '2025-01-19T15:00:00',
    read: true,
  },
  {
    id: 6,
    type: 'client',
    title: 'Novo cliente via WhatsApp',
    description: 'Carlos Oliveira foi cadastrado automaticamente',
    time: '2025-01-19T11:20:00',
    read: true,
  },
  {
    id: 7,
    type: 'appointment',
    title: 'Agendamento confirmado',
    description: 'João Santos confirmou o serviço de amanhã',
    time: '2025-01-19T09:00:00',
    read: true,
  },
  {
    id: 8,
    type: 'stock',
    title: 'Material zerado',
    description: 'Capacitor 35+5μF está zerado no estoque',
    time: '2025-01-18T14:00:00',
    read: true,
  },
]

const typeConfig = {
  appointment: { icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  service_order: {
    icon: Wrench,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  stock: { icon: Package, color: 'text-red-400', bg: 'bg-red-500/10' },
  financial: {
    icon: DollarSign,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  client: { icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
}

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState('all')

  const unreadCount = notifications.filter((n) => !n.read).length

  const filteredNotifications = notifications.filter(
    (n) => filter === 'all' || n.type === filter
  )

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Notificações</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A1A] border-white/10">
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="appointment">Agendamentos</SelectItem>
              <SelectItem value="service_order">Ordens de Serviço</SelectItem>
              <SelectItem value="stock">Estoque</SelectItem>
              <SelectItem value="financial">Financeiro</SelectItem>
              <SelectItem value="client">Clientes</SelectItem>
            </SelectContent>
          </Select>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="border-white/10 text-white hover:bg-white/5"
            >
              <CheckCheck className="h-4 w-4 mr-2" />
              Marcar todas
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <Bell className="h-10 w-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/40">Nenhuma notificação</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const config = typeConfig[notification.type]
            const Icon = config.icon

            return (
              <div
                key={notification.id}
                className={`glass-card rounded-xl p-4 transition-all cursor-pointer hover:border-white/10 ${
                  !notification.read ? 'border-l-2 border-l-cyan-500' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`h-5 w-5 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={`font-medium text-sm ${
                            notification.read ? 'text-white/70' : 'text-white'
                          }`}
                        >
                          {notification.title}
                        </h3>
                        <p className="text-xs text-white/40 mt-0.5">
                          {notification.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-white/30">
                          {format(new Date(notification.time), 'dd/MM HH:mm')}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteNotification(notification.id)
                          }}
                          className="p-1 rounded hover:bg-white/5 text-white/20 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-4 right-4" />
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
