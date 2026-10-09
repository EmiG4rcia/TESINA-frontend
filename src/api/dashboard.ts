import api from './client'
import type { DashboardData } from '../types'

export const dashboardApi = {
  get: async (): Promise<DashboardData> => {
    const res = await api.get('/dashboard')
    return res.data
  },
}