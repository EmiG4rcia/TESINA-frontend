import api from './client'
import type { TokenResponse, UserCreate, UserUpdate, User, ChangePasswordRequest } from '../types'

export const authApi = {
  login: async (username: string, password: string): Promise<TokenResponse> => {
    const res = await api.post('/auth/login', { username, password })
    return res.data
  },

  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me')
    return res.data
  },

  getUsers: async (): Promise<User[]> => {
    const res = await api.get('/auth/users')
    return res.data
  },

  createUser: async (data: UserCreate): Promise<User> => {
    const res = await api.post('/auth/users', data)
    return res.data
  },

  updateUser: async (id: number, data: UserUpdate): Promise<User> => {
    const res = await api.patch(`/auth/users/${id}`, data)
    return res.data
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/auth/users/${id}`)
  },

  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await api.post('/auth/change-password', data)
  },
}