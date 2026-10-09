import api from './client'
import type { StockMovement, StockPurchase, StockAdjustment } from '../types'

export const stockApi = {
  getMovements: async (
    itemType?: string,
    itemId?: number,
    skip = 0,
    limit = 50
  ): Promise<StockMovement[]> => {
    const res = await api.get('/stock', {
      params: {
        ...(itemType ? { item_type: itemType } : {}),
        ...(itemId ? { item_id: itemId } : {}),
        skip,
        limit,
      },
    })
    return res.data
  },

  purchase: async (data: StockPurchase): Promise<StockMovement> => {
    const res = await api.post('/stock/purchase', data)
    return res.data
  },

  adjust: async (data: StockAdjustment): Promise<StockMovement> => {
    const res = await api.post('/stock/adjustment', data)
    return res.data
  },
}