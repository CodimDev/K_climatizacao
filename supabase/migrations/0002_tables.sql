-- Profiles
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role role_enum not null default 'tecnico',
  phone text,
  status user_status_enum not null default 'ativo',
  theme text,
  last_access timestamptz,
  created_at timestamptz not null default now()
);

-- Clients
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  address text,
  neighborhood text,
  city text,
  notes text,
  total_services int default 0,
  last_service_date date,
  created_at timestamptz not null default now()
);

-- Equipments
create table if not exists public.equipments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  type service_type_enum,
  brand text,
  model text,
  capacity text,
  serial_number text,
  location text,
  installation_date date,
  last_maintenance date,
  created_at timestamptz not null default now()
);

-- Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric not null default 0,
  duration int not null default 60,
  category service_type_enum not null default 'instalacao',
  active boolean not null default true
);

-- Appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  client_name text,
  client_phone text,
  client_address text,
  service_name text,
  service_price numeric,
  date date not null,
  time text not null,
  status appointment_status_enum not null default 'pendente',
  origin text,
  notes text,
  created_at timestamptz not null default now()
);

-- Service Orders
create table if not exists public.service_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  client_id uuid references public.clients(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  client_name text,
  client_phone text,
  client_address text,
  service_type service_type_enum,
  service_name text,
  service_price numeric,
  description text,
  equipment_type service_type_enum,
  equipment_brand text,
  equipment_capacity text,
  equipment_serial text,
  scheduled_date date,
  scheduled_time text,
  priority priority_enum default 'normal',
  origin text,
  technician text,
  sla_hours int default 24,
  status appointment_status_enum not null default 'pendente',
  opened_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  technical_notes text,
  materials_used jsonb,
  created_at timestamptz not null default now()
);

-- Stock Items
create table if not exists public.stock_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category stock_category_enum not null default 'pecas',
  quantity int not null default 0,
  unit unit_enum not null default 'un',
  min_quantity int not null default 1,
  notes text,
  created_at timestamptz not null default now()
);

-- Stock Movements
create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  stock_id uuid not null references public.stock_items(id) on delete cascade,
  material_name text,
  type movement_type_enum not null,
  quantity int not null,
  reason text,
  service_order_id uuid references public.service_orders(id) on delete set null,
  created_date timestamptz not null default now()
);

-- Financial Transactions
create table if not exists public.financial_transactions (
  id uuid primary key default gen_random_uuid(),
  type financial_type_enum not null,
  category financial_category_enum not null,
  description text,
  amount numeric not null,
  date date not null,
  payment_method payment_method_enum,
  created_at timestamptz not null default now()
);

-- Schedule Config
create table if not exists public.schedule_config (
  id uuid primary key default gen_random_uuid(),
  work_start_time text,
  work_end_time text,
  slot_duration_min int default 60,
  days_off jsonb,
  created_at timestamptz not null default now()
);

-- Índices
create index if not exists idx_service_orders_status on public.service_orders(status);
create index if not exists idx_appointments_date on public.appointments(date);
create index if not exists idx_financial_date on public.financial_transactions(date);
create index if not exists idx_stock_movements_stock on public.stock_movements(stock_id);

