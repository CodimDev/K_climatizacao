Supabase Backend

1. Execute os arquivos em `supabase/migrations` em ordem (0001 → 0004).
2. Crie buckets de Storage: `documents`, `equipment-images` e aplique regras para usuários autenticados.
3. Configure Auth e insira um registro em `profiles` para cada usuário do `auth.users` com `role` adequado.
4. Use a função RPC `use_material` ao registrar materiais usados em OS.
5. Triggers já atualizam estoque e criam lançamentos financeiros ao concluir OS.
