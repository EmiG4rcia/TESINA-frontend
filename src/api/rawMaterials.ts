import api from './client'
import type { RawMaterial, RawMaterialCreate, RawMaterialUpdate } from '../types'

export const rawMaterialsApi = {
  getAll: async (includeInactive = false): Promise<RawMaterial[]> => {
    const res = await api.get('/raw-materials', {
      params: includeInactive ? { include_inactive: true } : undefined,
    })
    return res.data
  },

  getById: async (id: number): Promise<RawMaterial> => {
    const res = await api.get(`/raw-materials/${id}`)
    return res.data
  },

  create: async (data: RawMaterialCreate): Promise<RawMaterial> => {
    const res = await api.post('/raw-materials', data)
    return res.data
  },

  update: async (id: number, data: RawMaterialUpdate): Promise<RawMaterial> => {
    const res = await api.patch(`/raw-materials/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/raw-materials/${id}`)
  },
}