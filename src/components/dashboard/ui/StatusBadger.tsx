import React from 'react'

const statusConfig = {
  pendente: {
    label: 'Pendente',
    dot: 'bg-slate-400 dark:bg-slate-500',
    bg: 'bg-slate-100 dark:bg-slate-500/10',
    text: 'text-slate-600 dark:text-slate-400',
    border: 'border-slate-200 dark:border-slate-500/20',
  },
  confirmado: {
    label: 'Confirmado',
    dot: 'bg-cyan-400',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  em_execucao: {
    label: 'Em Execução',
    dot: 'bg-amber-400 animate-pulse',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  concluido: {
    label: 'Concluído',
    dot: 'bg-emerald-400',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
  },
  cancelado: {
    label: 'Cancelado',
    dot: 'bg-red-400',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
  },
}

type StatusKey = keyof typeof statusConfig
type Size = 'xs' | 'sm' | 'md'
type Props = {
  status: StatusKey
  size?: Size
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const config = statusConfig[status] || statusConfig.pendente

  const sizeClasses: Record<Size, string> = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-[11px] px-2.5 py-1',
    md: 'text-xs px-3 py-1.5',
  }
  const sizeClass = sizeClasses[size] ?? sizeClasses.sm

  return (
    <span
      className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${config.bg} ${config.text} ${config.border} border
      ${sizeClass}
    `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
