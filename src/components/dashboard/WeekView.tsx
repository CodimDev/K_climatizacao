import React from 'react'

export default function WeekView({ appointments = [] }: { appointments?: any[] }) {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-medium text-white/60 mb-4">Semana</h3>
      <p className="text-xs text-white/40">Total de serviços: {appointments.length}</p>
    </div>
  )
}
