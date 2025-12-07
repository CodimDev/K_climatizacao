import type React from 'react'

declare module '@/api/base44Client' {
  export const base44: any
}

declare module '@/utils' {
  export const createPageUrl: (...args: any[]) => string
}

declare module '@/components/ui/button' {
  export const Button: React.ComponentType<any>
  export default Button
}

declare module '@/components/ui/input' {
  export const Input: React.ComponentType<any>
  export default Input
}

declare module '@/components/ui/select' {
  export const Select: React.ComponentType<any>
  export const SelectTrigger: React.ComponentType<any>
  export const SelectValue: React.ComponentType<any>
  export const SelectContent: React.ComponentType<any>
  export const SelectItem: React.ComponentType<any>
}

declare module '@/components/ui/dialog' {
  export const Dialog: React.ComponentType<any>
  export const DialogContent: React.ComponentType<any>
  export const DialogHeader: React.ComponentType<any>
  export const DialogTitle: React.ComponentType<any>
}

declare module '@/components/ui/dropdown-menu' {
  export const DropdownMenu: React.ComponentType<any>
  export const DropdownMenuTrigger: React.ComponentType<any>
  export const DropdownMenuContent: React.ComponentType<any>
  export const DropdownMenuItem: React.ComponentType<any>
  export const DropdownMenuSeparator: React.ComponentType<any>
}

declare module '@/components/ui/label' {
  export const Label: React.ComponentType<any>
  export default Label
}

declare module '@/components/ui/textarea' {
  export const Textarea: React.ComponentType<any>
  export default Textarea
}

declare module '@/components/ui/StatusBadge' {
  const StatusBadge: React.ComponentType<any>
  export default StatusBadge
}

declare module '@/components/ui/badge' {
  export const Badge: React.ComponentType<any>
  export default Badge
}

declare module '@/components/ui/switch' {
  export const Switch: React.ComponentType<any>
  export default Switch
}

declare module '@/components/ui/checkbox' {
  export const Checkbox: React.ComponentType<any>
  export default Checkbox
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
