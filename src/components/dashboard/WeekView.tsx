import Card from '../ui/Card'

type Day = { day: string; scheduled: number }
type Props = { days: Day[] }

export default function WeekView({ days }: Props) {
  return (
    <Card title="Semana">
      <div className="grid grid-cols-7 gap-2">
        {days.map(d => (
          <div key={d.day} className="rounded-md border border-gray-200 dark:border-gray-800 p-2 text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400">{d.day}</div>
            <div className="text-lg font-semibold">{d.scheduled}</div>
          </div>
        ))}
      </div>
    </Card>
  )
}
