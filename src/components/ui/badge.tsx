import * as React from 'react'

export function Badge({ className = '', children }: { className?: string; children?: React.ReactNode }) {
  return <span className={`inline-flex items-center rounded-md border border-border px-2 py-0.5 text-xs ${className}`}>{children}</span>
}

export default Badge
