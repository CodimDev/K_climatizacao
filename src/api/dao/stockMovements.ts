import { supabase } from '@/api/supabaseClient'
import { base44 } from '@/api/base44Client'

const url = import.meta.env.VITE_SUPABASE_URL as string
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string
const useFallback = !url || !anon

export const stockMovementsDao = {
  list: async (order?: string, limit?: number) => {
    if (useFallback) return base44.entities.StockMovement.list(order, limit)
    let q = supabase.from('stock_movements').select('*')
    if (order)
      q = q.order(order.replace('-', ''), { ascending: !order.startsWith('-') })
    if (limit) q = q.limit(limit)
    const { data, error } = await q
    if (error) throw error
    return data || []
  },
  create: async (data: Record<string, any>) => {
    if (useFallback) return base44.entities.StockMovement.create(data)
    const { data: row, error } = await supabase
      .from('stock_movements')
      .insert(data)
      .select('*')
      .single()
    if (error) throw error
    return row
  },
}
