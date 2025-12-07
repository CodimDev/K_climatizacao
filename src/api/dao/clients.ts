import { supabase } from '@/api/supabaseClient'
import { base44 } from '@/api/base44Client'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const useFallback = !url || !anon

export const clientsDao = {
  list: async (order?: string, limit?: number) => {
    if (useFallback) return base44.entities.Client.list(order, limit)
    let q = supabase.from('clients').select('*')
    if (order)
      q = q.order(order.replace('-', ''), { ascending: !order.startsWith('-') })
    if (limit) q = q.limit(limit)
    const { data, error } = await q
    if (error) throw error
    return data || []
  },
  filter: async (where: Record<string, any>) => {
    if (useFallback) return base44.entities.Client.filter(where)
    let q = supabase.from('clients').select('*')
    Object.entries(where || {}).forEach(([k, v]) => {
      q = q.eq(k, v as any)
    })
    const { data, error } = await q
    if (error) throw error
    return data || []
  },
  create: async (data: Record<string, any>) => {
    if (useFallback) return base44.entities.Client.create(data)
    const { data: rows, error } = await supabase
      .from('clients')
      .insert(data)
      .select('*')
      .single()
    if (error) throw error
    return rows
  },
  update: async (id: any, data: Record<string, any>) => {
    if (useFallback) return base44.entities.Client.update(id, data)
    const { data: rows, error } = await supabase
      .from('clients')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw error
    return rows
  },
  delete: async (id: any) => {
    if (useFallback) return base44.entities.Client.delete(id)
    const { error } = await supabase.from('clients').delete().eq('id', id)
    if (error) throw error
  },
}
