import { Priority } from '@/types'

type Props = { priority: Priority }

const map: Record<Priority, string> = {
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
  urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200',
}

export default function PriorityBadge({ priority }: Props) {
  return <span className={`inline-flex items-center rounded px-2 py-1 text-xs ${map[priority]}`}>{priority}</span>
}
