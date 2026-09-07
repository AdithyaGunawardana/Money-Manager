import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import { getDashboard } from '../api/dashboard'

const fmt = (n) => `${Number(n).toFixed(2)}`

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    setLoading(true)
    getDashboard(month).then((d) => { setData(d); setLoading(false) })
  }, [month])

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Dashboard</h1>
          <input
            type="month" value={month} onChange={(e) => setMonth(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm"
          />
        </div>

        {loading || !data ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <StatCard label="Total Income" value={fmt(data.totalIncome)} colorClass="text-income" />
              <StatCard label="Total Expenses" value={fmt(data.totalExpense)} colorClass="text-expense" />
              <StatCard label="Balance" value={fmt(data.balance)} colorClass={data.balance >= 0 ? 'text-income' : 'text-expense'} />
              <StatCard label="This Month Income" value={fmt(data.monthlyIncome)} colorClass="text-income" />
              <StatCard label="This Month Expenses" value={fmt(data.monthlyExpense)} colorClass="text-expense" />
              <StatCard label="Top Expense Category" value={data.topExpenseCategory || '—'} />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-4 py-3 border-b font-semibold text-sm">Recent Transactions</div>
              {data.recentTransactions.length === 0 ? (
                <p className="p-6 text-gray-500 text-center text-sm">No transactions yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <tbody className="divide-y divide-gray-100">
                    {data.recentTransactions.map((t) => (
                      <tr key={`${t.type}-${t.id}`} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${t.type === 'INCOME' ? 'bg-green-100 text-income' : 'bg-red-100 text-expense'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-2">{t.label}</td>
                        <td className="px-4 py-2 text-gray-500">{t.date}</td>
                        <td className={`px-4 py-2 text-right font-medium ${t.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                          {t.type === 'INCOME' ? '+' : '-'}{fmt(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
