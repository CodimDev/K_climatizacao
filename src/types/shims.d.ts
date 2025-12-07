import type React from 'react'

declare module '@/api/base44Client' {
  export const base44: any
}

declare module '@/utils' {
  export const createPageUrl: (...args: any[]) => string
}


declare module '../Layout' {
  export function useTheme(): {
    theme: string
    setTheme: (value: any) => void
    toggleTheme: () => void
  }
}

declare module '@tanstack/react-query' {
  interface QueryClient {
    invalidateQueries(queryKey: any): Promise<void>
  }
}
