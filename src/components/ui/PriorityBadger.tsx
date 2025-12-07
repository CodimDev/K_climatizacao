import React from 'react'
import {
  AlertTriangle,
  Zap,
  Minus,
  ArrowUp,
  type LucideProps,
} from 'lucide-react'

const priorityConfig = {
  baixa: {
    label: 'Baixa',
    icon: Minus,
    bg: 'bg-white/5',
    text: 'text-white/50',
    border: 'border-white/10',
  },
  normal: {
    label: 'Normal',
    icon: ArrowUp,
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  alta: {
    label: 'Alta',
    icon: AlertTriangle,
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
  },
  urgente: {
    label: 'Urgente',
    icon: Zap,
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
  },
}

type PriorityKey = keyof typeof priorityConfig
type IconType = React.ComponentType<Omit<LucideProps, 'ref'>>
type Props = { priority: PriorityKey }

export default function PriorityBadge({ priority }: Props) {
  const config = priorityConfig[priority] || priorityConfig.normal
  const Icon: IconType = config.icon as IconType

  return (
    <span
      className={`
      inline-flex items-center gap-1.5 rounded-full text-[11px] px-2.5 py-1 font-medium
      ${config.bg} ${config.text} ${config.border} border
    `}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  )
}
