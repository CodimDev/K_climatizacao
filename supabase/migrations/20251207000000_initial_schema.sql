-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Helper to create enum if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'tecnico');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_status') THEN
        CREATE TYPE user_status AS ENUM ('ativo', 'inativo');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'equipment_type') THEN
        CREATE TYPE equipment_type AS ENUM ('ar_condicionado', 'geladeira', 'freezer', 'maquina_lavar', 'outro');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_category') THEN
        CREATE TYPE service_category AS ENUM ('instalacao', 'manutencao_preventiva', 'manutencao_corretiva', 'limpeza', 'outro');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
        CREATE TYPE appointment_status AS ENUM ('agendado', 'confirmado', 'em_andamento', 'concluido', 'cancelado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_order_status') THEN
        CREATE TYPE service_order_status AS ENUM ('aberto', 'em_andamento', 'pendente_peca', 'concluido', 'cancelado');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_order_priority') THEN
        CREATE TYPE service_order_priority AS ENUM ('baixa', 'media', 'alta', 'urgente');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_category') THEN
        CREATE TYPE stock_category AS ENUM ('peca', 'ferramenta', 'insumo', 'equipamento');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stock_unit') THEN
        CREATE TYPE stock_unit AS ENUM ('unidade', 'metro', 'kg', 'litro', 'caixa');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'movement_type') THEN
        CREATE TYPE movement_type AS ENUM ('entrada', 'saida');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_type') THEN
        CREATE TYPE transaction_type AS ENUM ('entrada', 'saida');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'transaction_category') THEN
        CREATE TYPE transaction_category AS ENUM ('servico', 'venda', 'compra_peca', 'salario', 'transporte', 'alimentacao', 'outro');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'boleto', 'transferencia');
    END IF;
END $$;

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role user_role DEFAULT 'tecnico',
  phone TEXT,
  status user_status DEFAULT 'ativo',
  theme TEXT DEFAULT 'light',
  last_access TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT profiles_user_id_key UNIQUE (user_id)
);

-- CLIENTS
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  neighborhood TEXT,
  city TEXT,
  notes TEXT,
  total_services INT DEFAULT 0,
  last_service_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EQUIPMENTS
CREATE TABLE IF NOT EXISTS equipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  type equipment_type NOT NULL,
  brand TEXT,
  model TEXT,
  capacity TEXT,
  serial_number TEXT,
  location TEXT,
  installation_date DATE,
  last_maintenance DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  duration INT,
  category service_category DEFAULT 'outro',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status appointment_status DEFAULT 'agendado',
  origin TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SERVICE ORDERS
CREATE TABLE IF NOT EXISTS service_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE, -- Generator handled in trigger or app logic
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  client_name TEXT,
  client_phone TEXT,
  client_address TEXT,
  service_type service_category,
  service_name TEXT,
  service_price NUMERIC(10, 2),
  description TEXT,
  equipment_type equipment_type,
  equipment_brand TEXT,
  equipment_capacity TEXT,
  equipment_serial TEXT,
  scheduled_date DATE,
  scheduled_time TEXT,
  priority service_order_priority DEFAULT 'media',
  origin TEXT,
  technician TEXT,
  sla_hours INT,
  status service_order_status DEFAULT 'aberto',
  opened_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  technical_notes TEXT,
  materials_used JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STOCK ITEMS
CREATE TABLE IF NOT EXISTS stock_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category stock_category DEFAULT 'peca',
  quantity INT DEFAULT 0,
  unit stock_unit DEFAULT 'unidade',
  min_quantity INT DEFAULT 5,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- STOCK MOVEMENTS
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stock_id UUID REFERENCES stock_items(id) ON DELETE CASCADE,
  material_name TEXT,
  type movement_type NOT NULL,
  quantity INT NOT NULL,
  reason TEXT,
  service_order_id UUID REFERENCES service_orders(id) ON DELETE SET NULL,
  created_date TIMESTAMPTZ DEFAULT NOW()
);

-- FINANCIAL TRANSACTIONS
CREATE TABLE IF NOT EXISTS financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type transaction_type NOT NULL,
  category transaction_category DEFAULT 'outro',
  description TEXT,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  payment_method payment_method DEFAULT 'dinheiro',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SCHEDULE CONFIG
CREATE TABLE IF NOT EXISTS schedule_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  work_start_time TEXT DEFAULT '08:00',
  work_end_time TEXT DEFAULT '18:00',
  slot_duration_min INT DEFAULT 60,
  days_off JSONB DEFAULT '["Sunday"]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_config ENABLE ROW LEVEL SECURITY;

-- Helper function for Admin check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies
DO $$
BEGIN
    -- PROFILES
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Enable read access for authenticated users') THEN
        CREATE POLICY "Enable read access for authenticated users" ON profiles FOR SELECT TO authenticated USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Enable update for users based on id') THEN
        CREATE POLICY "Enable update for users based on id" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
    END IF;

    -- CLIENTS
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'clients' AND policyname = 'Access clients') THEN
        CREATE POLICY "Access clients" ON clients FOR ALL TO authenticated USING (true);
    END IF;

    -- EQUIPMENTS
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'equipments' AND policyname = 'Access equipments') THEN
        CREATE POLICY "Access equipments" ON equipments FOR ALL TO authenticated USING (true);
    END IF;

    -- SERVICES
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'services' AND policyname = 'Access services') THEN
        CREATE POLICY "Access services" ON services FOR ALL TO authenticated USING (true);
    END IF;

    -- APPOINTMENTS
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Access appointments') THEN
        CREATE POLICY "Access appointments" ON appointments FOR ALL TO authenticated USING (true);
    END IF;

    -- SERVICE ORDERS
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'service_orders' AND policyname = 'Access service_orders') THEN
        CREATE POLICY "Access service_orders" ON service_orders FOR ALL TO authenticated USING (true);
    END IF;

    -- STOCK ITEMS
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stock_items' AND policyname = 'Access stock_items') THEN
        CREATE POLICY "Access stock_items" ON stock_items FOR ALL TO authenticated USING (true);
    END IF;

    -- STOCK MOVEMENTS
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'stock_movements' AND policyname = 'Access stock_movements') THEN
        CREATE POLICY "Access stock_movements" ON stock_movements FOR ALL TO authenticated USING (true);
    END IF;

    -- SCHEDULE CONFIG
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'schedule_config' AND policyname = 'Access schedule_config') THEN
        CREATE POLICY "Access schedule_config" ON schedule_config FOR ALL TO authenticated USING (true);
    END IF;

    -- FINANCIAL TRANSACTIONS
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'financial_transactions' AND policyname = 'Access financial_transactions') THEN
        CREATE POLICY "Access financial_transactions" ON financial_transactions FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- FUNCTIONS & TRIGGERS

-- Update Stock
CREATE OR REPLACE FUNCTION update_stock_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type = 'entrada' THEN
    UPDATE stock_items SET quantity = quantity + NEW.quantity WHERE id = NEW.stock_id;
  ELSIF NEW.type = 'saida' THEN
    UPDATE stock_items SET quantity = quantity - NEW.quantity WHERE id = NEW.stock_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_stock_quantity ON stock_movements;
CREATE TRIGGER trigger_update_stock_quantity
AFTER INSERT ON stock_movements
FOR EACH ROW EXECUTE FUNCTION update_stock_quantity();

-- Financial on Service Order Completion
CREATE OR REPLACE FUNCTION create_transaction_on_so_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'concluido' AND OLD.status != 'concluido' THEN
    INSERT INTO financial_transactions (type, category, description, amount, date, payment_method)
    VALUES (
      'entrada',
      'servico',
      'OS #' || COALESCE(NEW.order_number, 'N/A') || ' - ' || COALESCE(NEW.service_name, 'Serviço'),
      COALESCE(NEW.service_price, 0),
      CURRENT_DATE,
      'dinheiro'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_transaction_on_so_completion ON service_orders;
CREATE TRIGGER trigger_create_transaction_on_so_completion
AFTER UPDATE ON service_orders
FOR EACH ROW EXECUTE FUNCTION create_transaction_on_so_completion();

-- Handle New User
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'tecnico');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- STORAGE
-- We cannot use IF NOT EXISTS inside INSERT directly for values, using ON CONFLICT
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false), ('equipment-images', 'equipment-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated users can read documents') THEN
        CREATE POLICY "Authenticated users can read documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'documents');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated users can upload documents') THEN
        CREATE POLICY "Authenticated users can upload documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated users can read equipment-images') THEN
        CREATE POLICY "Authenticated users can read equipment-images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'equipment-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Authenticated users can upload equipment-images') THEN
        CREATE POLICY "Authenticated users can upload equipment-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'equipment-images');
    END IF;
END $$;
