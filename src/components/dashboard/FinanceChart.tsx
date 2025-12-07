import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

type Point = { dateLabel: string; receita: number; despesa: number; saldo: number }

export default function FinanceChart({ data = [], revenue = 0, expenses = 0, balance = 0 }: { data?: Point[]; revenue?: number; expenses?: number; balance?: number }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/60">Financeiro</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">R$ {(revenue / 1000).toFixed(1)}k</span>
          <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">R$ {(expenses / 1000).toFixed(1)}k</span>
          <span className={`text-xs px-2 py-1 rounded border ${balance >= 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>R$ {(balance / 1000).toFixed(1)}k</span>
        </div>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 8, right: 8, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradDespesa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="dateLabel" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} tickLine={false} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Tooltip
              contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              formatter={(value: any, name: any) => [`R$ ${(Number(value) / 1000).toFixed(2)}k`, name === 'receita' ? 'Receita' : name === 'despesa' ? 'Despesa' : 'Saldo']}
            />
            <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)' }} iconType="circle" />
            <Area type="monotone" dataKey="receita" name="Receita" stroke="#22d3ee" fill="url(#gradReceita)" strokeWidth={2} isAnimationActive dot={false} />
            <Area type="monotone" dataKey="despesa" name="Despesa" stroke="#f87171" fill="url(#gradDespesa)" strokeWidth={2} isAnimationActive dot={false} />
            <Line type="monotone" dataKey="saldo" name="Saldo" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
