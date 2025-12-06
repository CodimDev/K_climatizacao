import { Appointment, Client, Equipment, FinancialTransaction, Notification, Service, ServiceOrder, Settings, StockItem, StockMovement, User, UserPermissionsMatrix } from '../types'

export const clients: Client[] = [
  { id: 'C-01', name: 'Maria Silva', phone: '11 99999-0001', address: 'Rua A, 100' },
  { id: 'C-02', name: 'João Santos', phone: '11 99999-0002', address: 'Rua B, 200' },
]

export const services: Service[] = [
  { id: 'S-01', name: 'Instalação Split', description: 'Instalação de ar condicionado split', price: 450, durationMinutes: 120, category: 'Instalação', active: true },
  { id: 'S-02', name: 'Manutenção preventiva', description: 'Revisão periódica', price: 250, durationMinutes: 60, category: 'Manutenção', active: true },
]

export const equipments: Equipment[] = [
  { id: 'E-01', type: 'Split', brand: 'LG', model: 'Dual Inverter', capacity: '12k BTU', serialNumber: 'LG123', clientId: 'C-01', installedAt: new Date().toISOString() },
  { id: 'E-02', type: 'Split', brand: 'Samsung', model: 'WindFree', capacity: '18k BTU', serialNumber: 'SS456', clientId: 'C-02' },
]

export const serviceOrders: ServiceOrder[] = [
  { id: 'SO-101', clientId: 'C-01', title: 'Instalação Split 12k', status: 'in_progress', priority: 'high', scheduledAt: new Date().toISOString(), equipmentId: 'E-01', startedAt: new Date().toISOString() },
  { id: 'SO-102', clientId: 'C-02', title: 'Manutenção preventiva', status: 'open', priority: 'medium', scheduledAt: new Date().toISOString(), equipmentId: 'E-02' },
]

export const appointments: Appointment[] = [
  { id: 'A-01', clientId: 'C-01', serviceId: 'S-01', date: new Date().toISOString().slice(0,10), time: '10:00', status: 'confirmed' },
  { id: 'A-02', clientId: 'C-02', serviceId: 'S-02', date: new Date().toISOString().slice(0,10), time: '14:00', status: 'pending' },
]

export const transactions: FinancialTransaction[] = [
  { id: 'FT-01', type: 'income', amount: 1200, date: new Date().toISOString(), category: 'Serviço', method: 'pix' },
  { id: 'FT-02', type: 'expense', amount: 300, date: new Date().toISOString(), category: 'Peças', method: 'card' },
]

export const stock: StockItem[] = [
  { id: 'ST-01', name: 'Filtro 12k', sku: 'FLT12', quantity: 2, minQuantity: 5 },
  { id: 'ST-02', name: 'Gás R410A', sku: 'GAS410', quantity: 10, minQuantity: 8 },
]

export const stockMovements: StockMovement[] = [
  { id: 'SM-01', itemId: 'ST-01', type: 'out', quantity: 1, reason: 'Instalação', serviceOrderId: 'SO-101', date: new Date().toISOString() },
]

export const notifications: Notification[] = [
  { id: 'N-01', title: 'Estoque baixo', description: 'Filtro 12k abaixo do mínimo', type: 'warning', read: false, date: new Date().toISOString() },
]

export const users: User[] = [
  { id: 'U-01', name: 'Operador', role: 'operator', email: 'op@empresa.com', active: true },
]

export const permissions: UserPermissionsMatrix[] = [
  { userId: 'U-01', module: 'ServiceOrders', permissions: ['view','edit'] },
]

export const settings: Settings = {
  companyName: 'K Climatização',
  phone: '11 4002-8922',
  email: 'contato@kclimatizacao.com',
  messageTemplates: { reminder: 'Olá, lembramos do seu agendamento.' }
}
