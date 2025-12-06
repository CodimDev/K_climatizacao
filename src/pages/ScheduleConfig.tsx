import { useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import Button from '../components/ui/Button'
import { ScheduleConfig as ScheduleCfg } from '../types'

export default function ScheduleConfig() {
  const [form, setForm] = useState<ScheduleCfg>({ workDays: ['Mon','Tue','Wed','Thu','Fri'], startHour: '08:00', endHour: '18:00', intervalMinutes: 60, maxPerDay: 8 })
  const [preview, setPreview] = useState<string[]>([])
  const generate = () => {
    const slots: string[] = []
    const [startH, startM] = form.startHour.split(':').map(Number)
    const [endH, endM] = form.endHour.split(':').map(Number)
    let cur = startH*60 + startM
    const end = endH*60 + endM
    while (cur + form.intervalMinutes <= end) {
      const h = Math.floor(cur/60).toString().padStart(2,'0')
      const m = (cur%60).toString().padStart(2,'0')
      slots.push(`${h}:${m}`)
      cur += form.intervalMinutes
    }
    setPreview(slots.slice(0, form.maxPerDay))
  }
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="text-2xl font-semibold">Configuração de Agenda</div>
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Input label="Início" type="time" value={form.startHour} onChange={e => setForm({ ...form, startHour: e.target.value })} />
          <Input label="Fim" type="time" value={form.endHour} onChange={e => setForm({ ...form, endHour: e.target.value })} />
          <Input label="Intervalo (min)" type="number" value={form.intervalMinutes.toString()} onChange={e => setForm({ ...form, intervalMinutes: Number(e.target.value) })} />
          <Input label="Máximo por dia" type="number" value={form.maxPerDay.toString()} onChange={e => setForm({ ...form, maxPerDay: Number(e.target.value) })} />
        </div>
        <div className="flex justify-end mt-2">
          <Button onClick={generate}>Gerar slots</Button>
        </div>
      </Card>
      <Card title="Pré-visualização">
        <div className="flex flex-wrap gap-2">
          {preview.map(p => (
            <div key={p} className="rounded-md border border-gray-200 dark:border-gray-800 px-2 py-1 text-sm">{p}</div>
          ))}
        </div>
      </Card>
    </div>
  )
}
