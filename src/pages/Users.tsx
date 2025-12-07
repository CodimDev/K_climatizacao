// @ts-nocheck
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import {
  Users as UsersIcon,
  Search,
  Plus,
  Shield,
  ShieldCheck,
  MoreHorizontal,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Clock,
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

const mockUsers = [
  {
    id: 1,
    name: 'João Técnico',
    email: 'joao@kclimatizacao.com',
    phone: '(11) 99999-1111',
    role: 'tecnico',
    status: 'ativo',
    created_at: '2024-01-15',
    last_access: '2025-01-20 14:30',
  },
  {
    id: 2,
    name: 'Maria Admin',
    email: 'maria@kclimatizacao.com',
    phone: '(11) 99999-2222',
    role: 'admin',
    status: 'ativo',
    created_at: '2023-06-10',
    last_access: '2025-01-20 16:45',
  },
  {
    id: 3,
    name: 'Carlos Técnico',
    email: 'carlos@kclimatizacao.com',
    phone: '(11) 99999-3333',
    role: 'tecnico',
    status: 'inativo',
    created_at: '2024-03-20',
    last_access: '2025-01-10 09:15',
  },
  {
    id: 4,
    name: 'Ana Suporte',
    email: 'ana@kclimatizacao.com',
    phone: '(11) 99999-4444',
    role: 'admin',
    status: 'ativo',
    created_at: '2024-08-01',
    last_access: '2025-01-19 11:20',
  },
]

export default function Users() {
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  )

  const openNewUser = () => {
    setEditingUser({
      name: '',
      email: '',
      phone: '',
      role: 'tecnico',
      password: '',
      status: 'ativo',
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Usuários</h1>
          <p className="text-white/40 text-sm mt-0.5">
            Gerencie técnicos e administradores
          </p>
        </div>
        <div className="flex gap-2">
          <Link to={createPageUrl('UserPermissions')}>
            <Button
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5"
            >
              <Shield className="h-4 w-4 mr-2" />
              Permissões
            </Button>
          </Link>
          <Button
            onClick={openNewUser}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="glass-card rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="glass-card rounded-xl p-5 hover:border-white/10 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    user.role === 'admin'
                      ? 'bg-gradient-to-br from-purple-500/20 to-purple-400/10 border border-purple-500/20'
                      : 'bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 border border-cyan-500/20'
                  }`}
                >
                  <span
                    className={`font-bold ${
                      user.role === 'admin'
                        ? 'text-purple-400'
                        : 'text-cyan-400'
                    }`}
                  >
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    {user.name}
                  </h3>
                  <Badge
                    className={`text-[10px] ${
                      user.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    } border`}
                  >
                    {user.role === 'admin' ? 'Administrador' : 'Técnico'}
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
                  <DropdownMenuItem className="text-white hover:bg-white/5">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2 text-xs text-white/50 mb-4">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                <span>Criado em {user.created_at}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Último acesso: {user.last_access}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5">
              <Badge
                className={`text-[10px] ${
                  user.status === 'ativo'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                } border`}
              >
                {user.status === 'ativo' ? (
                  <>
                    <UserCheck className="h-3 w-3 mr-1" /> Ativo
                  </>
                ) : (
                  <>
                    <UserX className="h-3 w-3 mr-1" /> Inativo
                  </>
                )}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#1A1A1A] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
          </DialogHeader>

          {editingUser && (
            <div className="space-y-4 pt-4">
              <div>
                <Label className="text-white/60">Nome Completo</Label>
                <Input
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white/60">E-mail</Label>
                <Input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white/60">Telefone</Label>
                <Input
                  value={editingUser.phone}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, phone: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div>
                <Label className="text-white/60">Função</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, role: value })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10">
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/60">Senha</Label>
                <Input
                  type="password"
                  value={editingUser.password}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, password: e.target.value })
                  }
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="••••••••"
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
                <Button className="bg-cyan-500 hover:bg-cyan-400 text-black">
                  Criar Usuário
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
