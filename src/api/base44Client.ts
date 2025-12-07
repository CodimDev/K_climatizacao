type AnyRecord = Record<string, any>

const stores: Record<string, AnyRecord[]> = {
  ServiceOrder: [],
  Financial: [],
  Stock: [],
  StockMovement: [],
  Client: [],
  Equipment: [],
  Appointment: [],
  Service: [],
  ScheduleConfig: [],
}

function list(entity: string, _order?: string, _limit?: number) {
  const data = stores[entity] || []
  return Promise.resolve([...data])
}

function filter(entity: string, where: AnyRecord) {
  const data = stores[entity] || []
  const keys = Object.keys(where || {})
  const out = data.filter((r) =>
    keys.every((k) => String(r[k]) === String(where[k]))
  )
  return Promise.resolve(out)
}

function create(entity: string, data: AnyRecord) {
  const id = data.id ?? String(Date.now())
  const rec = { ...data, id }
  stores[entity] = [...(stores[entity] || []), rec]
  return Promise.resolve(rec)
}

function update(entity: string, id: any, data: AnyRecord) {
  const arr = stores[entity] || []
  const idx = arr.findIndex((r) => String(r.id) === String(id))
  if (idx >= 0) arr[idx] = { ...arr[idx], ...data }
  stores[entity] = arr
  return Promise.resolve(arr[idx] ?? null)
}

function remove(entity: string, id: any) {
  const arr = stores[entity] || []
  stores[entity] = arr.filter((r) => String(r.id) !== String(id))
  return Promise.resolve()
}

export const base44 = {
  auth: {
    me: async () => ({
      id: 'user-1',
      full_name: 'Administrador',
      email: 'admin@example.com',
      role: 'admin',
      theme: 'dark',
      permissions: {
        dashboard: { view: true },
        service_orders: { view: true },
        appointments: { view: true },
        clients: { view: true },
        equipments: { view: true },
        services: { view: true },
        financial: { view: true },
        stock: { view: true },
        users: { view: true },
        settings: { view: true },
      },
    }),
    logout: () => {},
  },
  entities: {
    ServiceOrder: {
      list: (order?: string, limit?: number) =>
        list('ServiceOrder', order, limit),
      filter: (where: AnyRecord) => filter('ServiceOrder', where),
      create: (data: AnyRecord) => create('ServiceOrder', data),
      update: (id: any, data: AnyRecord) => update('ServiceOrder', id, data),
      delete: (id: any) => remove('ServiceOrder', id),
    },
    Financial: {
      list: (order?: string, limit?: number) => list('Financial', order, limit),
      filter: (where: AnyRecord) => filter('Financial', where),
      create: (data: AnyRecord) => create('Financial', data),
      update: (id: any, data: AnyRecord) => update('Financial', id, data),
      delete: (id: any) => remove('Financial', id),
    },
    Stock: {
      list: (order?: string, limit?: number) => list('Stock', order, limit),
      filter: (where: AnyRecord) => filter('Stock', where),
      create: (data: AnyRecord) => create('Stock', data),
      update: (id: any, data: AnyRecord) => update('Stock', id, data),
      delete: (id: any) => remove('Stock', id),
    },
    StockMovement: {
      list: (order?: string, limit?: number) =>
        list('StockMovement', order, limit),
      create: (data: AnyRecord) => create('StockMovement', data),
    },
    Client: {
      list: (order?: string, limit?: number) => list('Client', order, limit),
      filter: (where: AnyRecord) => filter('Client', where),
      create: (data: AnyRecord) => create('Client', data),
      update: (id: any, data: AnyRecord) => update('Client', id, data),
      delete: (id: any) => remove('Client', id),
    },
    Equipment: {
      list: (order?: string, limit?: number) => list('Equipment', order, limit),
      filter: (where: AnyRecord) => filter('Equipment', where),
      create: (data: AnyRecord) => create('Equipment', data),
      update: (id: any, data: AnyRecord) => update('Equipment', id, data),
      delete: (id: any) => remove('Equipment', id),
    },
    Appointment: {
      list: (order?: string, limit?: number) =>
        list('Appointment', order, limit),
      create: (data: AnyRecord) => create('Appointment', data),
      update: (id: any, data: AnyRecord) => update('Appointment', id, data),
      delete: (id: any) => remove('Appointment', id),
    },
    Service: {
      list: (order?: string, limit?: number) => list('Service', order, limit),
      create: (data: AnyRecord) => create('Service', data),
      update: (id: any, data: AnyRecord) => update('Service', id, data),
      delete: (id: any) => remove('Service', id),
    },
    ScheduleConfig: {
      list: () => list('ScheduleConfig'),
      create: (data: AnyRecord) => create('ScheduleConfig', data),
      update: (id: any, data: AnyRecord) => update('ScheduleConfig', id, data),
    },
  },
}

export default base44
