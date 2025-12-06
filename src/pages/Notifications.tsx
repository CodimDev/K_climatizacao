import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { notifications as initial } from '../mock/data'

export default function Notifications() {
  const [notifications, setNotifications] = useState(initial)
  const markAll = () => setNotifications(n => n.map(x => ({ ...x, read: true })))
  const remove = (id: string) => setNotifications(n => n.filter(x => x.id !== id))
  const mark = (id: string) => setNotifications(n => n.map(x => x.id === id ? { ...x, read: true } : x))
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">Notificações</div>
        <Button variant="secondary" onClick={markAll}>Marcar todas como lidas</Button>
      </div>
      <Card>
        <ul className="space-y-2">
          {notifications.map(n => (
            <li key={n.id} className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{n.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{n.description}</div>
              </div>
              <div className="flex items-center gap-2">
                {!n.read && <Button size="sm" onClick={() => mark(n.id)}>Marcar lida</Button>}
                <Button size="sm" variant="ghost" onClick={() => remove(n.id)}>Excluir</Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
