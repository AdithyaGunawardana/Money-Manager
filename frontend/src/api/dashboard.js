import api from './axios'

export const getDashboard = (month) => {
  const params = month ? { month } : {}
  return api.get('/dashboard', { params }).then(r => r.data)
}
