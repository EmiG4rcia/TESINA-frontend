import api from './client'
import type { User, UserCreate, UserUpdate } from '../types'

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const res = await api.get('/auth/users')
    return res.data
  },

  create: async (data: UserCreate): Promise<User> => {
    const res = await api.post('/auth/users', data)
    return res.data
  },

  update: async (id: number, data: UserUpdate): Promise<User> => {
    const res = await api.patch(`/auth/users/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/auth/users/${id}`)
  },
}