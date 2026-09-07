import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.address, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-md bg-navy font-display text-sm font-bold text-white">MM</span>
          <h1 className="font-display text-2xl font-bold text-navy">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Start with a clearer view of your money</p>
        </div>

        {error && <div className="mb-4 rounded-md bg-expense-soft px-3 py-2 text-sm text-expense">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Name</label>
            <input name="name" required value={form.name} onChange={handleChange}
              className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input type="email" name="email" required value={form.email} onChange={handleChange}
              className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Address</label>
            <input name="address" value={form.address} onChange={handleChange}
              className="input-field" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input type="password" name="password" required minLength={6} value={form.password} onChange={handleChange}
              className="input-field" />
          </div>
          <button type="submit" disabled={loading}
            className="mt-2 w-full rounded-md bg-primary py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-indigo-600">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
