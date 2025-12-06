import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { settings } from '../mock/data'
import { useState } from 'react'

export default function SettingsPage() {
  const [form, setForm] = useState(settings)
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="text-2xl font-semibold">Configurações</div>
      <Card>
        <div className="space-y-2">
          <Input label="Empresa" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
          <Input label="Telefone" value={form.phone ?? ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" value={form.email ?? ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          <div className="flex justify-end">
            <Button>Salvar</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
