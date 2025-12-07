-- Buckets
insert into storage.buckets (id, name, public) values ('documents','documents', false) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('equipment-images','equipment-images', false) on conflict do nothing;

-- Policies for storage.objects
create policy storage_read_authenticated on storage.objects for select using (auth.uid() is not null);
create policy storage_insert_authenticated on storage.objects for insert with check (auth.uid() is not null);
create policy storage_update_authenticated on storage.objects for update using (auth.uid() is not null) with check (auth.uid() is not null);
create policy storage_delete_admin on storage.objects for delete using (public.current_role() = 'admin');

