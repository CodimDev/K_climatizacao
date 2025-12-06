import { appointments, clients, equipments, permissions, serviceOrders, settings, stock, stockMovements, services, transactions, users } from '../mock/data'
import type { Appointment, Client, Equipment, FinancialTransaction, Notification, Service, ServiceOrder, Settings, StockItem, StockMovement, User, UserPermissionsMatrix } from '../types'

export const base44 = {
  entities: {
    ServiceOrder: {
      async list(): Promise<ServiceOrder[]> { return Promise.resolve(serviceOrders) }
    },
    Financial: {
      async list(): Promise<FinancialTransaction[]> { return Promise.resolve(transactions) }
    },
    Stock: {
      async list(): Promise<StockItem[]> { return Promise.resolve(stock) }
    },
    Client: {
      async list(): Promise<Client[]> { return Promise.resolve(clients) }
    },
    Appointment: {
      async list(): Promise<Appointment[]> { return Promise.resolve(appointments) }
    },
    Equipment: {
      async list(): Promise<Equipment[]> { return Promise.resolve(equipments) }
    },
    Service: {
      async list(): Promise<Service[]> { return Promise.resolve(services) }
    },
    Settings: {
      async read(): Promise<Settings> { return Promise.resolve(settings) }
    },
    StockMovement: {
      async list(): Promise<StockMovement[]> { return Promise.resolve(stockMovements) }
    },
    User: {
      async list(): Promise<User[]> { return Promise.resolve(users) }
    },
    Permission: {
      async list(): Promise<UserPermissionsMatrix[]> { return Promise.resolve(permissions) }
    }
  }
}
