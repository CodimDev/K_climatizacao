import { useTheme } from './contexts/ThemeContext'
import Dashboard from './pages/Dashboard'

export default function App() {
  const { theme } = useTheme()
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <Dashboard />
      </div>
    </div>
  )
}
