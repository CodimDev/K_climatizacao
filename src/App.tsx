import { useTheme } from './contexts/ThemeContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Layout from './components/layout/Layout'

export default function App() {
  const { theme } = useTheme()
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <BrowserRouter>
          <Layout>
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
          </Layout>
        </BrowserRouter>
      </div>
    </div>
  )
}
