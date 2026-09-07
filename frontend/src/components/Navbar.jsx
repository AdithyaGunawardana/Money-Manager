import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) return null

  const linkClass = 'px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100'

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-1">
          <span className="font-bold text-primary mr-4">💰 Money Manager</span>
          <Link to="/dashboard" className={linkClass}>Dashboard</Link>
          <Link to="/expenses" className={linkClass}>Expenses</Link>
          <Link to="/income" className={linkClass}>Income</Link>
          <Link to="/profile" className={linkClass}>Profile</Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">{user.name}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm bg-gray-800 text-white rounded-md hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
