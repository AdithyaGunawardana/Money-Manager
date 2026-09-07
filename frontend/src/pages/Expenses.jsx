import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses'
import { formatAmount } from '../utils/format'

const CATEGORIES = ['FOOD', 'TRANSPORT', 'BILLS', 'SHOPPING', 'ENTERTAINMENT', 'OTHER']
const EMPTY_FORM = { title: '', category: 'FOOD', amount: '', transactionDate: '', note: '' }
const TODAY = new Date().toISOString().slice(0, 10)

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const data = await getExpenses()
    setExpenses(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, transactionDate: new Date().toISOString().slice(0, 10) })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (exp) => {
    setEditingId(exp.id)
    setForm({ title: exp.title, category: exp.category, amount: exp.amount, transactionDate: exp.transactionDate, note: exp.note || '' })
    setError('')
    setModalOpen(true)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, amount: parseFloat(form.amount) }
      if (editingId) {
        await updateExpense(editingId, payload)
      } else {
        await createExpense(payload)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return
    await deleteExpense(id)
    load()
  }

  return (
    <div className="min-h-screen bg-page lg:pl-64">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">Spending</p>
            <h1 className="page-title">Expenses</h1>
            <p className="mt-2 text-sm text-slate-500">Keep track of where your money goes.</p>
          </div>
          <button onClick={openAdd} className="rounded-md bg-expense px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700">
            Add expense
          </button>
        </div>

        <div className="surface overflow-hidden shadow-soft">
          {loading ? (
            <p className="p-8 text-center text-sm text-slate-500">Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <p className="p-8 text-center text-sm text-slate-500">No expenses yet. Add your first one.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 text-right font-semibold">Amount</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-700">{exp.title}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{exp.category}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{exp.transactionDate}</td>
                    <td className="px-5 py-4 text-right font-semibold text-expense">-{formatAmount(exp.amount)}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button onClick={() => openEdit(exp)} className="mr-3 text-xs font-semibold text-indigo-600 hover:text-indigo-800">Edit</button>
                      <button onClick={() => handleDelete(exp.id)} className="text-xs font-semibold text-rose-600 hover:text-rose-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Expense' : 'Add Expense'}>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" required value={form.title} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input type="number" step="0.01" min="0.01" name="amount" required value={form.amount} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" name="transactionDate" required value={form.transactionDate} onChange={handleChange}
              max={TODAY}
              className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea name="note" value={form.note} onChange={handleChange} rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <button type="submit" className="w-full bg-primary text-white rounded-md py-2 font-medium hover:bg-blue-700">
            {editingId ? 'Save Changes' : 'Add Expense'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
