import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  const links = [
    { to: '/dashboard', label: 'Overview', mark: 'O' },
    { to: '/expenses', label: 'Expenses', mark: 'E' },
    { to: '/income', label: 'Income', mark: 'I' }
  ]

  return (
    <nav className="border-b border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex h-16 items-center justify-between px-5 lg:h-24 lg:px-7">
        <Link to="/dashboard" className="flex items-center gap-3 text-navy">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-navy font-display text-sm font-bold text-white">MM</span>
          <span className="font-display text-base font-bold">Money Manager</span>
        </Link>
        <span className="hidden text-xs font-medium text-slate-400 lg:block">PERSONAL</span>
      </div>
      <div className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:gap-2 lg:px-4 lg:py-6">
        {links.map((link) => {
          const active = location.pathname === link.to
          return (
            <Link key={link.to} to={link.to} className={`flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-semibold transition ${active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
              <span className={`grid h-7 w-7 place-items-center rounded-md text-xs font-bold ${active ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{link.mark}</span>
              {link.label}
            </Link>
          )
        })}
        <Link to="/profile" className={`flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2.5 text-sm font-semibold transition ${location.pathname === '/profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
          <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-100 text-xs font-bold text-slate-500">P</span>
          Profile
        </Link>
      </div>
      <div className="hidden border-t border-slate-200 p-4 lg:block">
        <div className="mb-3 flex items-center gap-3 px-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">{user.name?.charAt(0).toUpperCase()}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">Sign out</button>
      </div>
    </nav>
  )
}
