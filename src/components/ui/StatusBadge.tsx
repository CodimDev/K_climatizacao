import { Status } from '@/types'

type Props = { status: Status }

const map: Record<Status, string> = {
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
  done: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
  cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-200',
}

export default function StatusBadge({ status }: Props) {
  return <span className={`inline-flex items-center rounded px-2 py-1 text-xs ${map[status]}`}>{status.replace('_', ' ')}</span>
}
