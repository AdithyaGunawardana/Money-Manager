import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('mm_user')
    return stored ? JSON.parse(stored) : null
  })

  const persist = (authResponse) => {
    localStorage.setItem('mm_token', authResponse.token)
    const userData = { id: authResponse.userId, name: authResponse.name, email: authResponse.email }
    localStorage.setItem('mm_user', JSON.stringify(userData))
    setUser(userData)
  }

  const login = async (email, password) => {
    const res = await loginUser({ email, password })
    persist(res)
  }

  const register = async (name, email, address, password) => {
    const res = await registerUser({ name, email, address, password })
    persist(res)
  }

  const logout = () => {
    localStorage.removeItem('mm_token')
    localStorage.removeItem('mm_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
