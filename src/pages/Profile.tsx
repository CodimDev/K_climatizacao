import { useTheme } from '../contexts/ThemeContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

export default function Profile() {
  const { theme, toggle } = useTheme()
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="text-2xl font-semibold">Perfil</div>
      <Card>
        <div className="flex items-center justify-between">
          <div className="text-sm">Tema: {theme === 'dark' ? 'Escuro' : 'Claro'}</div>
          <Button variant="secondary" onClick={toggle}>{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</Button>
        </div>
      </Card>
    </div>
  )
}
