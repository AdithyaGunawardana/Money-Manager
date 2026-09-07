import api from './axios'

export const getExpenses = () => api.get('/expenses').then(r => r.data)
export const createExpense = (data) => api.post('/expenses', data).then(r => r.data)
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data).then(r => r.data)
export const deleteExpense = (id) => api.delete(`/expenses/${id}`).then(r => r.data)
