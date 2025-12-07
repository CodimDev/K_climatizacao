import '@testing-library/jest-dom'
import { vi } from 'vitest'

vi.mock('@/api/supabaseClient', () => {
  const ok = Promise.resolve({ data: [], error: null })
  const query: any = {
    select: () => ok,
    insert: () => ok,
    update: () => ok,
    delete: () => ok,
    eq: () => query,
    ilike: () => query,
    order: () => query,
    limit: () => query,
  }
  return {
    supabase: {
      from: () => query,
      storage: {
        from: () => ({
          upload: () => ok,
          getPublicUrl: () => ({ data: { publicUrl: '' }, error: null }),
        }),
      },
      auth: {
        getSession: () =>
          Promise.resolve({ data: { session: null }, error: null }),
      },
    },
  }
})

// Polyfill para ResizeObserver usado por componentes de gráfico
class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}
// @ts-ignore
global.ResizeObserver = global.ResizeObserver || RO
