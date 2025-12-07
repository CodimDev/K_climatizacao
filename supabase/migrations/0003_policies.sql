-- Helper function: current_role
create or replace function public.current_role()
returns role_enum language sql stable as $$
  select p.role from public.profiles p where p.user_id = auth.uid();
$$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.equipments enable row level security;
alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.service_orders enable row level security;
alter table public.stock_items enable row level security;
alter table public.stock_movements enable row level security;
alter table public.financial_transactions enable row level security;
alter table public.schedule_config enable row level security;

-- General policies: authenticated users can select/insert/update; delete reserved to admins on sensitive tables
do $$
begin
  -- profiles: users can select/update own profile
  create policy profiles_select on public.profiles for select
    using (user_id = auth.uid());
  create policy profiles_update on public.profiles for update
    using (user_id = auth.uid()) with check (user_id = auth.uid());

  -- Generic tables
  for tbl in select unnest(array[
    'clients','equipments','services','appointments','service_orders','stock_items','stock_movements','schedule_config'
  ]) loop
    execute format('create policy %I_select on public.%I for select using (auth.uid() is not null);', tbl, tbl);
    execute format('create policy %I_insert on public.%I for insert with check (auth.uid() is not null);', tbl, tbl);
    execute format('create policy %I_update on public.%I for update using (auth.uid() is not null) with check (auth.uid() is not null);', tbl, tbl);
    execute format('create policy %I_delete_admin on public.%I for delete using (public.current_role() = ''admin'');', tbl, tbl);
  end loop;

  -- financial: restrict delete to admin; other ops to authenticated
  create policy financial_select on public.financial_transactions for select using (auth.uid() is not null);
  create policy financial_insert on public.financial_transactions for insert with check (public.current_role() = 'admin');
  create policy financial_update on public.financial_transactions for update using (public.current_role() = 'admin') with check (public.current_role() = 'admin');
  create policy financial_delete on public.financial_transactions for delete using (public.current_role() = 'admin');
end $$;

