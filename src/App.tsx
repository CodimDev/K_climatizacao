import { useTheme } from './contexts/ThemeContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

export default function App() {
  const { theme } = useTheme()
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={<div className="p-4">Configuração</div>}
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </div>
    </div>
  )
}
