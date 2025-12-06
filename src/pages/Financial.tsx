import { useMemo } from 'react'
import Card from '../components/ui/Card'
import KPICard from '../components/dashboard/KPICard'
import FinanceChart from '../components/dashboard/FinanceChart'
import { transactions } from '../mock/data'

export default function Financial() {
  const income = useMemo(() => transactions.filter(t => t.type === 'income').reduce((a,b)=>a+b.amount,0), [])
  const expense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((a,b)=>a+b.amount,0), [])
  const balance = income - expense
  const ticket = useMemo(() => {
    const ins = transactions.filter(t => t.type === 'income')
    return ins.length ? ins.reduce((a,b)=>a+b.amount,0)/ins.length : 0
  }, [])
  const series = useMemo(() => {
    const byDay: Record<string,{income:number,expense:number}> = {}
    transactions.forEach(t=>{
      const day = new Date(t.date).toLocaleDateString('pt-BR',{weekday:'short'})
      if(!byDay[day]) byDay[day] = { income:0, expense:0 }
      if(t.type==='income') byDay[day].income += t.amount
      else byDay[day].expense += t.amount
    })
    return Object.entries(byDay).map(([date,v])=>({date, income:v.income, expense:v.expense}))
  }, [])
  return (
    <div className="mx-auto max-w-7xl p-4 space-y-4">
      <div className="text-2xl font-semibold">Financeiro</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard kpi={{ label: 'Receita', value: income, delta: 12, trend: 'up' }} />
        <KPICard kpi={{ label: 'Despesas', value: expense, delta: 5, trend: 'down' }} />
        <KPICard kpi={{ label: 'Saldo', value: balance }} />
        <KPICard kpi={{ label: 'Ticket médio', value: Math.round(ticket) }} />
      </div>
      <FinanceChart data={series} />
      <Card title="Transações">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="p-2">Tipo</th>
                <th className="p-2">Valor</th>
                <th className="p-2">Data</th>
                <th className="p-2">Categoria</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id} className="border-t border-gray-200 dark:border-gray-800">
                  <td className="p-2">{t.type}</td>
                  <td className="p-2">R$ {t.amount.toFixed(2)}</td>
                  <td className="p-2">{new Date(t.date).toLocaleString('pt-BR')}</td>
                  <td className="p-2">{t.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
