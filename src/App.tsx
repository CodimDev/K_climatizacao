import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from '@/components/dashboard/layout/Layout'
import Dashboard from '@/pages/Dashboard'
import ServiceOrders from '@/pages/ServiceOrders'
import ServiceOrderDetails from '@/pages/ServiceOrderDetails'
import Appointments from '@/pages/Appointments'
import Clients from '@/pages/Clients'
import ClientDetails from '@/pages/ClientDetails'
import Equipments from '@/pages/Equipments'
import EquipmentDetails from '@/pages/EquipmentDetails'
import Services from '@/pages/Services'
import Financial from '@/pages/Financial'
import Stock from '@/pages/Stock'
import MaintenanceHistory from '@/pages/MaintenanceHistory'
import Notifications from '@/pages/Notifications'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'
import ScheduleConfig from '@/pages/ScheduleConfig'
import Users from '@/pages/Users'
import UserPermissions from '@/pages/UserPermissions'
import DocView from '@/pages/DocView'
import Login from '@/pages/Login'
import { supabase } from '@/api/supabaseClient'
import { Loader2 } from 'lucide-react'

function RequireAuth({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function withLayout(pageName: string, children: React.ReactNode) {
  return (
    <RequireAuth>
      <Layout currentPageName={pageName}>{children}</Layout>
    </RequireAuth>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/Dashboard" replace />} />
        <Route path="/Dashboard" element={withLayout('Dashboard', <Dashboard />)} />
        <Route path="/ServiceOrders" element={withLayout('ServiceOrders', <ServiceOrders />)} />
        <Route path="/ServiceOrderDetails" element={withLayout('ServiceOrders', <ServiceOrderDetails />)} />
        <Route path="/Appointments" element={withLayout('Appointments', <Appointments />)} />
        <Route path="/Clients" element={withLayout('Clients', <Clients />)} />
        <Route path="/ClientDetails" element={withLayout('Clients', <ClientDetails />)} />
        <Route path="/Equipments" element={withLayout('Equipments', <Equipments />)} />
        <Route path="/EquipmentDetails" element={withLayout('Equipments', <EquipmentDetails />)} />
        <Route path="/Services" element={withLayout('Services', <Services />)} />
        <Route path="/Financial" element={withLayout('Financial', <Financial />)} />
        <Route path="/Stock" element={withLayout('Stock', <Stock />)} />
        <Route path="/MaintenanceHistory" element={withLayout('MaintenanceHistory', <MaintenanceHistory />)} />
        <Route path="/Notifications" element={withLayout('Notifications', <Notifications />)} />
        <Route path="/Profile" element={withLayout('Profile', <Profile />)} />
        <Route path="/Settings" element={withLayout('Settings', <Settings />)} />
        <Route path="/ScheduleConfig" element={withLayout('ScheduleConfig', <ScheduleConfig />)} />
        <Route path="/Users" element={withLayout('Users', <Users />)} />
        <Route path="/UserPermissions" element={withLayout('UserPermissions', <UserPermissions />)} />
        <Route path="/DocView" element={withLayout('DocView', <DocView />)} />
        <Route path="*" element={<Navigate to="/Dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
