import api from './client'
import type { Delivery, DeliveryCreate, DeliveryUpdate } from '../types'

export const deliveriesApi = {
  getAll: async (params?: {
    destination_id?: number
    date_from?: string
    date_to?: string
    status?: string
  }): Promise<Delivery[]> => {
    const res = await api.get('/deliveries', { params })
    return res.data
  },

  getById: async (id: number): Promise<Delivery> => {
    const res = await api.get(`/deliveries/${id}`)
    return res.data
  },

  create: async (data: DeliveryCreate): Promise<Delivery> => {
    const res = await api.post('/deliveries', data)
    return res.data
  },

  complete: async (id: number): Promise<Delivery> => {
    const res = await api.post(`/deliveries/${id}/complete`)
    return res.data
  },

  update: async (id: number, data: DeliveryUpdate): Promise<Delivery> => {
    const res = await api.patch(`/deliveries/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/deliveries/${id}`)
  },
}