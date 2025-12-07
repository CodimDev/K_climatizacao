import React from 'react'
import { TrendingUp, TrendingDown, type LucideProps } from 'lucide-react'

type IconType = React.ComponentType<Omit<LucideProps, 'ref'>>

type Props = {
  title: string
  value: React.ReactNode | string | number
  subtitle?: string
  icon?: IconType
  trend?: 'up' | 'down'
  trendValue?: string
  color?: 'cyan' | 'green' | 'red' | 'amber' | 'purple' | 'blue'
  progress?: number
  className?: string
}

export default function KPICard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color = 'cyan',
  progress,
  className = '',
}: Props) {
  const colorMap = {
    cyan: {
      icon: 'from-cyan-500 to-cyan-400',
      glow: 'shadow-cyan-500/20',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20',
      progress: 'bg-cyan-500',
    },
    green: {
      icon: 'from-emerald-500 to-emerald-400',
      glow: 'shadow-emerald-500/20',
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      progress: 'bg-emerald-500',
    },
    red: {
      icon: 'from-red-500 to-red-400',
      glow: 'shadow-red-500/20',
      text: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      progress: 'bg-red-500',
    },
    amber: {
      icon: 'from-amber-500 to-amber-400',
      glow: 'shadow-amber-500/20',
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      progress: 'bg-amber-500',
    },
    purple: {
      icon: 'from-purple-500 to-purple-400',
      glow: 'shadow-purple-500/20',
      text: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      progress: 'bg-purple-500',
    },
    blue: {
      icon: 'from-blue-500 to-blue-400',
      glow: 'shadow-blue-500/20',
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      progress: 'bg-blue-500',
    },
  }

  const colors = colorMap[color] || colorMap.cyan

  return (
    <div
      className={`
      glass-card rounded-xl p-5
      hover:border-primary/20 dark:hover:border-white/10 transition-all duration-300
      group relative overflow-hidden
      ${className}
    `}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colors.bg}`}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          {Icon && (
            <div
              className={`p-2.5 rounded-lg bg-gradient-to-br ${colors.icon} ${colors.glow} shadow-lg`}
            >
              <Icon className="h-4 w-4 text-white" strokeWidth={2} />
            </div>
          )}

          {trend && trendValue && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium ${
                trend === 'up'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'bg-red-500/10 text-red-400'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trendValue}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {value}
          </p>
          <p className="text-xs text-muted-foreground font-medium">{title}</p>
          {subtitle && (
            <p className="text-[10px] text-muted-foreground/70">{subtitle}</p>
          )}
        </div>

        {progress !== undefined && (
          <div className="mt-4">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${colors.progress} rounded-full transition-all duration-500`}
                style={{
                  width: `${Math.max(0, Math.min(progress ?? 0, 100))}%`,
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground/70 mt-1">
              {progress}% do objetivo
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
