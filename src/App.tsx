import { useTheme } from './contexts/ThemeContext'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ServiceOrders from './pages/ServiceOrders'
import ServiceOrderDetails from './pages/ServiceOrderDetails'
import Appointments from './pages/Appointments'
import Clients from './pages/Clients'
import ClientDetails from './pages/ClientDetails'
import Equipments from './pages/Equipments'
import EquipmentDetails from './pages/EquipmentDetails'
import Services from './pages/Services'
import Financial from './pages/Financial'
import Stock from './pages/Stock'
import Profile from './pages/Profile'
import SettingsPage from './pages/Settings'
import MaintenanceHistory from './pages/MaintenanceHistory'
import Notifications from './pages/Notifications'
import Users from './pages/Users'
import UserPermissions from './pages/UserPermissions'
import ScheduleConfig from './pages/ScheduleConfig'

export default function App() {
  const { theme } = useTheme()
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <BrowserRouter>
          <header className="border-b border-gray-200 dark:border-gray-800">
            <div className="mx-auto max-w-7xl p-4 flex items-center gap-4 overflow-x-auto">
              <Link to="/" className="font-semibold">
                K Climatização
              </Link>
              <nav className="flex items-center gap-3 text-sm">
                <Link to="/" className="hover:underline">
                  Dashboard
                </Link>
                <Link to="/service-orders" className="hover:underline">
                  Ordens
                </Link>
                <Link to="/appointments" className="hover:underline">
                  Agendamentos
                </Link>
                <Link to="/clients" className="hover:underline">
                  Clientes
                </Link>
                <Link to="/equipments" className="hover:underline">
                  Equipamentos
                </Link>
                <Link to="/services" className="hover:underline">
                  Serviços
                </Link>
                <Link to="/financial" className="hover:underline">
                  Financeiro
                </Link>
                <Link to="/stock" className="hover:underline">
                  Estoque
                </Link>
                <Link to="/maintenance-history" className="hover:underline">
                  Manutenções
                </Link>
                <Link to="/notifications" className="hover:underline">
                  Notificações
                </Link>
                <Link to="/users" className="hover:underline">
                  Usuários
                </Link>
                <Link to="/permissions" className="hover:underline">
                  Permissões
                </Link>
                <Link to="/profile" className="hover:underline">
                  Perfil
                </Link>
                <Link to="/settings" className="hover:underline">
                  Configurações
                </Link>
                <Link to="/schedule-config" className="hover:underline">
                  Agenda
                </Link>
              </nav>
            </div>
          </header>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/service-orders" element={<ServiceOrders />} />
            <Route
              path="/service-orders/:id"
              element={<ServiceOrderDetails />}
            />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/clients/:id" element={<ClientDetails />} />
            <Route path="/equipments" element={<Equipments />} />
            <Route path="/equipments/:id" element={<EquipmentDetails />} />
            <Route path="/services" element={<Services />} />
            <Route path="/financial" element={<Financial />} />
            <Route path="/stock" element={<Stock />} />
            <Route
              path="/maintenance-history"
              element={<MaintenanceHistory />}
            />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/users" element={<Users />} />
            <Route path="/permissions" element={<UserPermissions />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/schedule-config" element={<ScheduleConfig />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  )
}
