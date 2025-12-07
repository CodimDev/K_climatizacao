## Objetivos
- Migrar do mock `base44` para um backend completo no Supabase (Auth, Postgres, Storage, Edge Functions).
- Preservar o comportamento das telas atuais (CRUDs e cálculos) com segurança (RLS) e performance.

## Arquitetura
- **Auth**: Supabase Auth com perfis em `profiles` (campos: `full_name`, `role`, `phone`, `status`, `theme`). Integração com sessão no layout atual.
- **Banco (Postgres)**: Tabelas para Clientes, Equipamentos, Serviços, Agendamentos, Ordens de Serviço, Estoque, Movimentações de Estoque, Financeiro, Configurações de Agenda.
- **Storage**: Buckets para `documents` e `equipment-images`.
- **Server-side**: Triggers/RPCs para ajustar estoque e gerar lançamentos financeiros; Edge Functions para tarefas assíncronas (ex.: notificações, PDFs).

## Mapeamento das telas → tabelas
- Referências usadas para extrair campos:
  - `src/pages/ServiceOrders.tsx:90-107` (campos da OS ao criar)
  - `src/pages/ServiceOrderDetails.tsx:296-363` (equipamento dentro da OS) e `src/pages/ServiceOrderDetails.tsx:365-406` (materiais usados)
  - `src/pages/Clients.tsx:77-87` (campos de cliente)
  - `src/pages/Stock.tsx:168-176` (novo material) e `src/pages/Stock.tsx:139-146` (movimentação)
  - `src/pages/Financial.tsx:138-147` (novo lançamento)
  - `src/pages/Appointments.tsx:106-118` (novo agendamento)

## Esquema de Banco (DDL simplificado)
- `profiles` (1:N com `auth.users`)
  - `id (uuid PK)`, `user_id (uuid FK auth.users)`, `full_name`, `email`, `role (enum: admin|tecnico)`, `phone`, `status (enum: ativo|inativo)`, `theme`, `last_access (timestamptz)`
- `clients`
  - `id (uuid PK)`, `name`, `phone`, `address`, `neighborhood`, `city`, `notes`, `total_services (int)`, `last_service_date (date)`, `created_at (timestamptz)`
- `equipments`
  - `id (uuid PK)`, `client_id (uuid FK clients)`, `type (enum)`, `brand`, `model`, `capacity`, `serial_number`, `location`, `installation_date (date)`, `last_maintenance (date)`, `created_at`
- `services`
  - `id (uuid PK)`, `name`, `description`, `price (numeric)`, `duration (int)`, `category (enum)`, `active (bool)`
- `appointments`
  - `id (uuid PK)`, `client_id (uuid FK clients)`, `service_id (uuid FK services)`, `date (date)`, `time (text)`, `status (enum)`, `origin (text)`, `notes`
- `service_orders`
  - `id (uuid PK)`, `order_number (text uniq)`, `client_id (uuid FK clients)`, `service_id (uuid FK services)`, `client_name`, `client_phone`, `client_address`, `service_type (enum)`, `service_name`, `service_price (numeric)`, `description`, `equipment_type (enum)`, `equipment_brand`, `equipment_capacity`, `equipment_serial`, `scheduled_date (date)`, `scheduled_time (text)`, `priority (enum)`, `origin (text)`, `technician (text)`, `sla_hours (int)`, `status (enum)`, `opened_at`, `started_at`, `completed_at`, `technical_notes`, `materials_used (jsonb)`
- `stock_items`
  - `id (uuid PK)`, `name`, `category (enum)`, `quantity (int)`, `unit (enum)`, `min_quantity (int)`, `notes`, `created_at`
- `stock_movements`
  - `id (uuid PK)`, `stock_id (uuid FK stock_items)`, `material_name`, `type (enum: entrada|saida)`, `quantity (int)`, `reason`, `service_order_id (uuid FK service_orders)`, `created_date (timestamptz default now())`
- `financial_transactions`
  - `id (uuid PK)`, `type (enum: entrada|saida)`, `category (enum)`, `description`, `amount (numeric)`, `date (date)`, `payment_method (enum)`, `created_at`
- `schedule_config`
  - `id (uuid PK)`, `work_start_time`, `work_end_time`, `slot_duration_min (int)`, `days_off (jsonb)`

## Índices e Views
- Índices em `service_orders.status`, `appointments.date`, `financial_transactions.date`, `stock_movements.stock_id`.
- Views para KPIs do Dashboard (receita do mês, despesas, ticket médio) com base em `financial_transactions` e OS concluídas.

## Segurança (RLS) e Papéis
- Ativar RLS em todas as tabelas.
- Políticas:
  - Leitura/Escrita: `auth.role()` via `profiles.role`; técnicos podem CRUD OS, agendamentos e uso de estoque; admins podem CRUD tudo, inclusive financeiro.
  - Regra geral: `using (exists(select 1 from profiles p where p.user_id = auth.uid()))` e `check` por tabela conforme papel.
- Sem multi-tenant por ora; se necessário, incluir `organization_id` e políticas por organização.

## Storage
- Buckets: `documents` (PDFs, anexos de OS) e `equipment-images`.
- Regras: leitura para usuários autenticados; escrita restringida por papel.

## Triggers/RPCs
- Trigger: `stock_movements` → atualiza `stock_items.quantity` (+/-) automaticamente.
- Trigger: `service_orders` quando `status` muda para `concluido` → insere `financial_transactions` com `amount = service_price` e `category = servico`.
- RPC: `use_material(stock_id, qty, service_order_id)` para registrar saída e motivo.
- Edge Functions: notificações de confirmação/cancelamento de agendamento; geração futura de PDF de OS.

## Migrações e Seeds
- Pasta `supabase/migrations` com arquivos SQL para enums, tabelas, índices, policies e triggers.
- Seeds dev para tabelas principais a partir dos defaults das telas.

## Integração no Frontend
- Adicionar `@supabase/supabase-js` e criar `src/api/supabaseClient.ts` com `createClient` usando `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
- Substituir `base44` gradualmente por um DAO:
  - `clientsDao`, `servicesDao`, `appointmentsDao`, `serviceOrdersDao`, `stockDao`, `financialDao` com métodos idênticos (`list`, `filter`, `create`, `update`, `delete`) mapeando para Supabase.
- Layout: trocar `base44.auth.me()` por sessão Supabase + fetch de `profiles` (`src/components/dashboard/layout/Layout.tsx`).
- Manter chaves do React Query; invalidar após mutations como já acontece.

## Variáveis de Ambiente
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Não versionar chaves; usar `.env.local`.

## Entregáveis
- Projeto Supabase pronto (tabelas, enums, policies, triggers, buckets).
- Scripts SQL de migração + seeds de desenvolvimento.
- Cliente Supabase no frontend e camada DAO compatível com `base44`.
- Documentação rápida no `DocView` com endpoints/consultas principais.

## Próximos Passos
1. Criar o projeto no Supabase e provisionar o esquema (SQL/migrations).
2. Configurar Auth e `profiles`; criar políticas RLS.
3. Configurar Storage e regras.
4. Implementar triggers/RPCs.
5. Adicionar cliente Supabase e camada DAO; trocar a primeira tela (Clientes) para validar fluxo.
6. Migrar telas restantes uma a uma.

Confirma prosseguir com essa implementação e começar pela criação do esquema no Supabase?