import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 py-10">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid h-11 w-11 place-items-center rounded-md bg-navy font-display text-sm font-bold text-white">MM</span>
          <h1 className="font-display text-2xl font-bold text-navy">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to your Money Manager account</p>
        </div>

        {error && <div className="mb-4 rounded-md bg-expense-soft px-3 py-2 text-sm text-expense">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="input-field"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full rounded-md bg-primary py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          No account? <Link to="/register" className="font-semibold text-indigo-600">Create one</Link>
        </p>
      </div>
    </div>
  )
}
