import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Dashboard from '../Dashboard'
import ServiceOrders from '../ServiceOrders'
import ServiceOrderDetails from '../ServiceOrderDetails'
import Appointments from '../Appointments'
import Clients from '../Clients'
import ClientDetails from '../ClientDetails'
import Equipments from '../Equipments'
import EquipmentDetails from '../EquipmentDetails'
import Services from '../Services'
import Financial from '../Financial'
import Stock from '../Stock'
import MaintenanceHistory from '../MaintenanceHistory'
import Notifications from '../Notifications'
import Profile from '../Profile'
import Settings from '../Settings'
import ScheduleConfig from '../ScheduleConfig'
import Users from '../Users'
import UserPermissions from '../UserPermissions'
import DocView from '../DocView'

function renderWithProviders(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/']}>{ui}</MemoryRouter>
    </QueryClientProvider>
  )
}

const pages: Array<[string, React.ComponentType<any>]> = [
  ['Dashboard', Dashboard],
  ['ServiceOrders', ServiceOrders],
  ['ServiceOrderDetails', ServiceOrderDetails],
  ['Appointments', Appointments],
  ['Clients', Clients],
  ['ClientDetails', ClientDetails],
  ['Equipments', Equipments],
  ['EquipmentDetails', EquipmentDetails],
  ['Services', Services],
  ['Financial', Financial],
  ['Stock', Stock],
  ['MaintenanceHistory', MaintenanceHistory],
  ['Notifications', Notifications],
  ['Profile', Profile],
  ['Settings', Settings],
  ['ScheduleConfig', ScheduleConfig],
  ['Users', Users],
  ['UserPermissions', UserPermissions],
  ['DocView', DocView],
]

describe('Smoke tests de páginas', () => {
  pages.forEach(([name, Component]) => {
    it(`monta ${name} sem falhar`, () => {
      const { container } = renderWithProviders(<Component />)
      expect(container.firstChild).toBeTruthy()
    })
  })
})
/// <reference types="vitest" />
