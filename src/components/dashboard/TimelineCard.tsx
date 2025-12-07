import React from 'react'

type Props = {
  title?: string
  items?: Array<any>
}

export default function TimelineCard({ title, items = [] }: Props) {
  return (
    <div className="glass-card rounded-xl p-5">
      {title && (
        <h3 className="text-sm font-medium text-white/60 mb-4">{title}</h3>
      )}
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-white/40 text-sm">Sem itens</p>
        ) : (
          items.map((it, i) => (
            <div key={i} className="flex items-center justify-between">
              <p className="text-sm text-white/80">{it.service_name || it.title || '-'}</p>
              <span className="text-[10px] text-white/30">
                {it.scheduled_date || it.time || ''}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
