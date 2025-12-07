-- Adjust stock on stock_movements
create or replace function public.apply_stock_movement()
returns trigger language plpgsql as $$
begin
  if new.type = 'entrada' then
    update public.stock_items set quantity = quantity + new.quantity where id = new.stock_id;
  else
    update public.stock_items set quantity = greatest(0, quantity - new.quantity) where id = new.stock_id;
  end if;
  return new;
end;
$$;

drop trigger if exists tg_apply_stock_movement on public.stock_movements;
create trigger tg_apply_stock_movement
after insert on public.stock_movements
for each row execute function public.apply_stock_movement();

-- Create financial entry when service order completed
create or replace function public.create_financial_on_completion()
returns trigger language plpgsql as $$
begin
  if new.status = 'concluido' and (old.status is distinct from 'concluido') and new.service_price is not null then
    insert into public.financial_transactions(type, category, description, amount, date, payment_method)
    values('entrada','servico', coalesce(new.service_name,'Serviço'), new.service_price, current_date, 'pix');
  end if;
  return new;
end;
$$;

drop trigger if exists tg_financial_on_completion on public.service_orders;
create trigger tg_financial_on_completion
after update on public.service_orders
for each row execute function public.create_financial_on_completion();

-- RPC: use_material
create or replace function public.use_material(p_stock_id uuid, p_qty int, p_service_order_id uuid)
returns void language plpgsql as $$
declare v_name text;
begin
  select name into v_name from public.stock_items where id = p_stock_id;
  insert into public.stock_movements(stock_id, material_name, type, quantity, reason, service_order_id)
  values(p_stock_id, v_name, 'saida', p_qty, 'Usado na OS', p_service_order_id);
end;
$$;

