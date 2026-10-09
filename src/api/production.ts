import api from './client'
import type { ProductionLog, ProductionLogCreate } from '../types'

export const productionApi = {
  getAll: async (productId?: number, skip = 0, limit = 50): Promise<ProductionLog[]> => {
    const res = await api.get('/production', {
      params: {
        ...(productId ? { product_id: productId } : {}),
        skip,
        limit,
      },
    })
    return res.data
  },

  getById: async (id: number): Promise<ProductionLog> => {
    const res = await api.get(`/production/${id}`)
    return res.data
  },

  create: async (data: ProductionLogCreate): Promise<ProductionLog> => {
    const res = await api.post('/production', data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/production/${id}`)
  },
}