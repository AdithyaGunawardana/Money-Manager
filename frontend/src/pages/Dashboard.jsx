import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import { getDashboard } from '../api/dashboard'
import { formatAmount } from '../utils/format'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    setLoading(true)
    getDashboard(month).then((d) => { setData(d); setLoading(false) })
  }, [month])

  return (
    <div className="min-h-screen bg-page lg:pl-64">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-2">Financial overview</p>
            <h1 className="page-title">Your financial overview</h1>
            <p className="mt-2 text-sm text-slate-500">Here is how your money is moving this month.</p>
          </div>
          <input
            type="month" value={month} onChange={(e) => setMonth(e.target.value)}
            className="input-field w-auto"
          />
        </div>

        {loading || !data ? (
          <div className="surface p-8 text-sm text-slate-500">Loading your overview...</div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <StatCard label="Total Income" value={formatAmount(data.totalIncome)} colorClass="text-income" />
              <StatCard label="Total Expenses" value={formatAmount(data.totalExpense)} colorClass="text-expense" />
              <StatCard label="Balance" value={formatAmount(data.balance)} colorClass={data.balance >= 0 ? 'text-income' : 'text-expense'} />
              <StatCard label="This Month Income" value={formatAmount(data.monthlyIncome)} colorClass="text-income" />
              <StatCard label="This Month Expenses" value={formatAmount(data.monthlyExpense)} colorClass="text-expense" />
              <StatCard label="Top Expense Category" value={data.topExpenseCategory || '—'} />
            </div>

            <div className="surface overflow-hidden shadow-soft">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div>
                  <p className="font-display text-base font-bold text-navy">Recent transactions</p>
                  <p className="mt-1 text-xs text-slate-400">Your income and spending activity for this month</p>
                </div>
              </div>
              {data.recentTransactions.length === 0 ? (
                <p className="p-8 text-center text-sm text-slate-500">No transactions yet.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <tbody className="divide-y divide-slate-100">
                    {data.recentTransactions.map((t) => (
                      <tr key={`${t.type}-${t.id}`} className="transition hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${t.type === 'INCOME' ? 'bg-income-soft text-income' : 'bg-expense-soft text-expense'}`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-700">{t.label}</td>
                        <td className="px-5 py-4 text-slate-400">{t.date}</td>
                        <td className={`px-5 py-4 text-right font-semibold ${t.type === 'INCOME' ? 'text-income' : 'text-expense'}`}>
                          {t.type === 'INCOME' ? '+' : '-'}{formatAmount(t.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
