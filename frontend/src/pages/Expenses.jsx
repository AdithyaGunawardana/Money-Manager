import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses'

const CATEGORIES = ['FOOD', 'TRANSPORT', 'BILLS', 'SHOPPING', 'ENTERTAINMENT', 'OTHER']
const EMPTY_FORM = { title: '', category: 'FOOD', amount: '', transactionDate: '', note: '' }

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
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Expenses</h1>
          <button onClick={openAdd} className="bg-expense text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
            + Add Expense
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-500 text-center">Loading...</p>
          ) : expenses.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No expenses yet. Add your first one.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Title</th>
                  <th className="px-4 py-2 font-medium">Category</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium text-right">Amount</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{exp.title}</td>
                    <td className="px-4 py-2">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{exp.category}</span>
                    </td>
                    <td className="px-4 py-2 text-gray-500">{exp.transactionDate}</td>
                    <td className="px-4 py-2 text-right font-medium text-expense">-{Number(exp.amount).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEdit(exp)} className="text-primary hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(exp.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

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
