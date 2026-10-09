import api from './client'
import type {
  ScheduledOrder, ScheduledOrderCreate, ScheduledOrderUpdate,
  ScheduledOrderItemUpdate
} from '../types'

export const scheduledOrdersApi = {
  getAll: async (params?: {
    destination_id?: number
    date_from?: string
    date_to?: string
    status?: string
  }): Promise<ScheduledOrder[]> => {
    const res = await api.get('/scheduled-orders', { params })
    return res.data
  },

  getById: async (id: number): Promise<ScheduledOrder> => {
    const res = await api.get(`/scheduled-orders/${id}`)
    return res.data
  },

  create: async (data: ScheduledOrderCreate): Promise<ScheduledOrder> => {
    const res = await api.post('/scheduled-orders', data)
    return res.data
  },

  update: async (id: number, data: ScheduledOrderUpdate): Promise<ScheduledOrder> => {
    const res = await api.patch(`/scheduled-orders/${id}`, data)
    return res.data
  },

  updateItem: async (
    orderId: number,
    itemId: number,
    data: ScheduledOrderItemUpdate
  ): Promise<void> => {
    await api.patch(`/scheduled-orders/${orderId}/items/${itemId}`, data)
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/scheduled-orders/${id}`)
  },
}