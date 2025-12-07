import React from 'react'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import {
  BookOpen,
  Settings,
  LayoutDashboard,
  ClipboardList,
  Calendar,
  Users,
  Package,
  Wrench,
  DollarSign,
  BarChart3,
  Bell,
} from 'lucide-react'

export default function DocView() {
  return (
    <div className="space-y-6">
      <div className="glass-card rounded-xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <BookOpen className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Documentação</h1>
            <p className="text-sm text-muted-foreground">
              Visão geral do sistema e navegação
            </p>
          </div>
        </div>
        <Link to={createPageUrl('Settings')}>
          <button className="h-9 px-3 rounded-md bg-muted/50 border border-border text-sm text-foreground hover:bg-muted">
            <Settings className="h-4 w-4 inline mr-2" /> Configurações
          </button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="glass-card rounded-xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Funcionalidades Principais
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <ClipboardList className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Ordens de Serviço</p>
                <p className="text-muted-foreground">
                  Criação, detalhamento, status, agendamento, materiais e
                  financeiro
                </p>
                <Link
                  to={createPageUrl('ServiceOrders')}
                  className="text-cyan-400 text-xs hover:underline"
                >
                  Abrir ServiceOrders
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Clientes</p>
                <p className="text-muted-foreground">
                  Cadastro completo, histórico e equipamentos associados
                </p>
                <Link
                  to={createPageUrl('Clients')}
                  className="text-cyan-400 text-xs hover:underline"
                >
                  Abrir Clients
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Equipamentos</p>
                <p className="text-muted-foreground">
                  Detalhamento, manutenção e vínculo com cliente
                </p>
                <Link
                  to={createPageUrl('Equipments')}
                  className="text-cyan-400 text-xs hover:underline"
                >
                  Abrir Equipments
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Agendamentos</p>
                <p className="text-muted-foreground">
                  Criação, edição e controle de status com configuração de
                  agenda
                </p>
                <Link
                  to={createPageUrl('Appointments')}
                  className="text-cyan-400 text-xs hover:underline"
                >
                  Abrir Appointments
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Financeiro</p>
                <p className="text-muted-foreground">
                  Lançamentos de receitas e despesas com indicadores e gráfico
                </p>
                <Link
                  to={createPageUrl('Financial')}
                  className="text-cyan-400 text-xs hover:underline"
                >
                  Abrir Financial
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Wrench className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Serviços</p>
                <p className="text-muted-foreground">
                  Catálogo com preço, duração, categoria e ativação
                </p>
                <Link
                  to={createPageUrl('Services')}
                  className="text-cyan-400 text-xs hover:underline"
                >
                  Abrir Services
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Estoque</p>
                <p className="text-muted-foreground">
                  Inventário e movimentações com alertas de mínimo
                </p>
                <Link
                  to={createPageUrl('Stock')}
                  className="text-cyan-400 text-xs hover:underline"
                >
                  Abrir Stock
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-card rounded-xl p-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Dashboard e UI/UX
          </h2>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <LayoutDashboard className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Visão Geral</p>
                <p className="text-muted-foreground">
                  KPIs, timeline, visão semanal e painel de prioridades
                </p>
                <Link
                  to={createPageUrl('Dashboard')}
                  className="text-cyan-400 text-xs hover:underline"
                >
                  Abrir Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BarChart3 className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Gráficos Financeiros</p>
                <p className="text-muted-foreground">
                  Recharts com áreas animadas, linha de saldo e tooltip
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Bell className="h-4 w-4 text-cyan-400 mt-0.5" />
              <div>
                <p className="font-medium">Notificações</p>
                <p className="text-muted-foreground">Lista e gerenciamento</p>
                <Link
                  to={createPageUrl('Notifications')}
                  className="text-cyan-400 text-xs hover:underline"
                >
                  Abrir Notifications
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="glass-card rounded-xl p-6">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Tecnologias e Arquitetura
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p className="font-medium">Tecnologias</p>
            <p className="text-muted-foreground">
              React, Tailwind CSS, Shadcn/ui, Lucide, React Query, React Router,
              Recharts
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Dependências:{' '}
              <span className="text-cyan-400">package.json:12-21</span>
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Alias de imports:{' '}
              <span className="text-cyan-400">vite.config.ts:9-10</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Dados (Híbrido)</p>
            <p className="text-muted-foreground">
              Migração de <code>base44Client</code> para Supabase DAO
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Cliente Supabase:{' '}
              <span className="text-cyan-400">src/api/supabaseClient.ts</span>
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              DAOs: <span className="text-cyan-400">src/api/dao/*.ts</span>
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Migrations:{' '}
              <span className="text-cyan-400">supabase/migrations</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Tema</p>
            <p className="text-muted-foreground">
              ThemeProvider com persistência em preferências do usuário
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Provider:{' '}
              <span className="text-cyan-400">
                src/components/dashboard/ThemeProvider.tsx:17-50
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Preferências:{' '}
              <span className="text-cyan-400">
                src/services/preferences.ts:1-14
              </span>
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Uso:{' '}
              <span className="text-cyan-400">
                src/components/dashboard/layout/Layout.tsx:114-118
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Navegação</p>
            <p className="text-muted-foreground">
              SPA com Layout, sidebar e topbar, rotas por página
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Rotas: <span className="text-cyan-400">src/App.tsx:31-50</span>
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              Query Provider:{' '}
              <span className="text-cyan-400">src/main.tsx:13-15</span>
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              URLs:{' '}
              <span className="text-cyan-400">src/utils/index.ts:1-3</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
