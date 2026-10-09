import api from './client'
import type { Destination, DestinationCreate, DestinationUpdate } from '../types'

export const destinationsApi = {
  getAll: async (includeInactive = false): Promise<Destination[]> => {
    const res = await api.get('/destinations', {
      params: includeInactive ? { include_inactive: true } : undefined,
    })
    return res.data
  },

  getById: async (id: number): Promise<Destination> => {
    const res = await api.get(`/destinations/${id}`)
    return res.data
  },

  create: async (data: DestinationCreate): Promise<Destination> => {
    const res = await api.post('/destinations', data)
    return res.data
  },

  update: async (id: number, data: DestinationUpdate): Promise<Destination> => {
    const res = await api.patch(`/destinations/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/destinations/${id}`)
  },
}