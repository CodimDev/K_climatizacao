import { supabase } from '@/api/supabaseClient'
import { base44 } from '@/api/base44Client'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const useFallback = !url || !anon

export const stockDao = {
  list: async (order?: string, limit?: number) => {
    if (useFallback) return base44.entities.Stock.list(order, limit)
    let q = supabase.from('stock_items').select('*')
    if (order)
      q = q.order(order.replace('-', ''), { ascending: !order.startsWith('-') })
    if (limit) q = q.limit(limit)
    const { data, error } = await q
    if (error) throw error
    return data || []
  },
  create: async (data: Record<string, any>) => {
    if (useFallback) return base44.entities.Stock.create(data)
    const { data: row, error } = await supabase
      .from('stock_items')
      .insert(data)
      .select('*')
      .single()
    if (error) throw error
    return row
  },
  update: async (id: any, data: Record<string, any>) => {
    if (useFallback) return base44.entities.Stock.update(id, data)
    const { data: row, error } = await supabase
      .from('stock_items')
      .update(data)
      .eq('id', id)
      .select('*')
      .single()
    if (error) throw error
    return row
  },
  delete: async (id: any) => {
    if (useFallback) return base44.entities.Stock.delete(id)
    const { error } = await supabase.from('stock_items').delete().eq('id', id)
    if (error) throw error
  },
}
