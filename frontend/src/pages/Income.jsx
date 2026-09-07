import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'
import { getIncomes, createIncome, updateIncome, deleteIncome } from '../api/incomes'

const EMPTY_FORM = { source: '', amount: '', receivedDate: '', note: '' }

export default function Income() {
  const [incomes, setIncomes] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    const data = await getIncomes()
    setIncomes(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, receivedDate: new Date().toISOString().slice(0, 10) })
    setError('')
    setModalOpen(true)
  }

  const openEdit = (inc) => {
    setEditingId(inc.id)
    setForm({ source: inc.source, amount: inc.amount, receivedDate: inc.receivedDate, note: inc.note || '' })
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
        await updateIncome(editingId, payload)
      } else {
        await createIncome(payload)
      }
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this income?')) return
    await deleteIncome(id)
    load()
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Income</h1>
          <button onClick={openAdd} className="bg-income text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
            + Add Income
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <p className="p-6 text-gray-500 text-center">Loading...</p>
          ) : incomes.length === 0 ? (
            <p className="p-6 text-gray-500 text-center">No income records yet. Add your first one.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-2 font-medium">Source</th>
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium text-right">Amount</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {incomes.map((inc) => (
                  <tr key={inc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{inc.source}</td>
                    <td className="px-4 py-2 text-gray-500">{inc.receivedDate}</td>
                    <td className="px-4 py-2 text-right font-medium text-income">+{Number(inc.amount).toFixed(2)}</td>
                    <td className="px-4 py-2 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => openEdit(inc)} className="text-primary hover:underline text-xs">Edit</button>
                      <button onClick={() => handleDelete(inc.id)} className="text-red-600 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Income' : 'Add Income'}>
        {error && <div className="bg-red-50 text-red-600 text-sm rounded-md px-3 py-2 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input name="source" required value={form.source} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
            <input type="number" step="0.01" min="0.01" name="amount" required value={form.amount} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Received Date</label>
            <input type="date" name="receivedDate" required value={form.receivedDate} onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea name="note" value={form.note} onChange={handleChange} rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <button type="submit" className="w-full bg-primary text-white rounded-md py-2 font-medium hover:bg-blue-700">
            {editingId ? 'Save Changes' : 'Add Income'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
