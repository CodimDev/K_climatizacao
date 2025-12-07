// @ts-nocheck
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { ArrowLeft, Shield, Eye, Edit2, Trash2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

const modules = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'appointments', label: 'Agendamentos' },
  { key: 'service_orders', label: 'Ordens de Serviço' },
  { key: 'stock', label: 'Estoque' },
  { key: 'financial', label: 'Financeiro' },
  { key: 'services', label: 'Serviços' },
  { key: 'settings', label: 'Configurações' },
]

const mockUsers = [
  { id: 1, name: 'João Técnico', role: 'tecnico' },
  { id: 2, name: 'Maria Admin', role: 'admin' },
  { id: 3, name: 'Carlos Técnico', role: 'tecnico' },
  { id: 4, name: 'Ana Suporte', role: 'admin' },
]

const defaultPermissions = {
  tecnico: {
    dashboard: { view: true, edit: false, delete: false, admin: false },
    appointments: { view: true, edit: true, delete: false, admin: false },
    service_orders: { view: true, edit: true, delete: false, admin: false },
    stock: { view: true, edit: true, delete: false, admin: false },
    financial: { view: false, edit: false, delete: false, admin: false },
    services: { view: true, edit: false, delete: false, admin: false },
    settings: { view: false, edit: false, delete: false, admin: false },
  },
  admin: {
    dashboard: { view: true, edit: true, delete: true, admin: true },
    appointments: { view: true, edit: true, delete: true, admin: true },
    service_orders: { view: true, edit: true, delete: true, admin: true },
    stock: { view: true, edit: true, delete: true, admin: true },
    financial: { view: true, edit: true, delete: true, admin: true },
    services: { view: true, edit: true, delete: true, admin: true },
    settings: { view: true, edit: true, delete: true, admin: true },
  },
}

export default function UserPermissions() {
  const [permissions, setPermissions] = useState(() => {
    const initial = {}
    mockUsers.forEach((user) => {
      initial[user.id] = { ...defaultPermissions[user.role] }
    })
    return initial
  })

  const togglePermission = (userId, module, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [module]: {
          ...prev[userId][module],
          [permission]: !prev[userId][module][permission],
        },
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to={createPageUrl('Users')}>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">
            Permissões de Usuários
          </h1>
          <p className="text-white/40 text-sm">Defina os acessos por módulo</p>
        </div>
      </div>

      {/* Permissions Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-xs font-medium text-white/40">
                  Módulo
                </th>
                {mockUsers.map((user) => (
                  <th key={user.id} className="text-center p-4 min-w-[140px]">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          user.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}
                      >
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <span className="text-xs text-white font-medium">
                        {user.name.split(' ')[0]}
                      </span>
                      <span className="text-[10px] text-white/40">
                        {user.role === 'admin' ? 'Admin' : 'Técnico'}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map((module, idx) => (
                <tr
                  key={module.key}
                  className={
                    idx !== modules.length - 1 ? 'border-b border-white/5' : ''
                  }
                >
                  <td className="p-4">
                    <span className="text-sm text-white font-medium">
                      {module.label}
                    </span>
                  </td>
                  {mockUsers.map((user) => (
                    <td key={user.id} className="p-4">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={() =>
                            togglePermission(user.id, module.key, 'view')
                          }
                          className={`p-1.5 rounded-md transition-all ${
                            permissions[user.id]?.[module.key]?.view
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-white/5 text-white/20'
                          }`}
                          title="Ver"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            togglePermission(user.id, module.key, 'edit')
                          }
                          className={`p-1.5 rounded-md transition-all ${
                            permissions[user.id]?.[module.key]?.edit
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-white/5 text-white/20'
                          }`}
                          title="Editar"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            togglePermission(user.id, module.key, 'delete')
                          }
                          className={`p-1.5 rounded-md transition-all ${
                            permissions[user.id]?.[module.key]?.delete
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-white/5 text-white/20'
                          }`}
                          title="Excluir"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            togglePermission(user.id, module.key, 'admin')
                          }
                          className={`p-1.5 rounded-md transition-all ${
                            permissions[user.id]?.[module.key]?.admin
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-white/5 text-white/20'
                          }`}
                          title="Administrar"
                        >
                          <Settings className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="glass-card rounded-xl p-4">
        <p className="text-xs text-white/40 mb-3">Legenda:</p>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-cyan-500/20">
              <Eye className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <span className="text-xs text-white/60">Ver</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-500/20">
              <Edit2 className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <span className="text-xs text-white/60">Editar</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-red-500/20">
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
            </div>
            <span className="text-xs text-white/60">Excluir</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-purple-500/20">
              <Settings className="h-3.5 w-3.5 text-purple-400" />
            </div>
            <span className="text-xs text-white/60">Administrar</span>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <Button className="bg-cyan-500 hover:bg-cyan-400 text-black font-medium">
          Salvar Permissões
        </Button>
      </div>
    </div>
  )
}
