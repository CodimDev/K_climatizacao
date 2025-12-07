import { supabase } from '@/api/supabaseClient'
import { base44 } from '@/api/base44Client'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const useFallback = !url || !anon

export const auth = {
  me: async () => {
    if (useFallback) return base44.auth.me()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) return base44.auth.me()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    return {
      id: user.id,
      full_name:
        profile?.full_name || user.user_metadata?.full_name || 'Usuário',
      email: user.email,
      role: profile?.role || 'tecnico',
      theme: profile?.theme || 'dark',
      permissions: profile?.permissions || {},
    }
  },
  logout: async () => {
    if (useFallback) return base44.auth.logout()
    await supabase.auth.signOut()
  },
}

export default auth
