import Card from '../components/ui/Card'
import { permissions, users } from '../mock/data'

export default function UserPermissions() {
  const modules = Array.from(new Set(permissions.map(p => p.module)))
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="text-2xl font-semibold">Permissões</div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="p-2 text-left">Usuário</th>
                {modules.map(m => (<th key={m} className="p-2 text-left">{m}</th>))}
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-gray-200 dark:border-gray-800">
                  <td className="p-2">{u.name}</td>
                  {modules.map(m => {
                    const p = permissions.find(x => x.userId === u.id && x.module === m)
                    return <td key={m} className="p-2">{p ? p.permissions.join(', ') : '-'}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
