import Card from '../ui/Card'
import { ServiceOrder } from '../../types'
import { format, startOfWeek, addDays } from 'date-fns'

type Props = { appointments: ServiceOrder[] }

export default function WeekView({ appointments }: Props) {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const labels = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']
  const days = labels.map((l, i) => {
    const day = addDays(weekStart, i)
    const count = appointments.filter(a => a.scheduledAt && format(new Date(a.scheduledAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')).length
    return { day: l, scheduled: count }
  })
  return (
    <Card title="Semana">
      <div className="grid grid-cols-7 gap-2">
        {days.map(d => (
          <div key={d.day} className="rounded-md border border-border p-2 text-center">
            <div className="text-xs text-muted-foreground">{d.day}</div>
            <div className="text-lg font-semibold">{d.scheduled}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
