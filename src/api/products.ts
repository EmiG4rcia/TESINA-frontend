import api from './client'
import type { Product, ProductCreate, ProductUpdate, RecipeItem, RecipeItemCreate } from '../types'

export const productsApi = {
  getAll: async (includeInactive = false): Promise<Product[]> => {
    const res = await api.get('/products', {
      params: includeInactive ? { include_inactive: true } : undefined,
    })
    return res.data
  },

  getById: async (id: number): Promise<Product> => {
    const res = await api.get(`/products/${id}`)
    return res.data
  },

  create: async (data: ProductCreate): Promise<Product> => {
    const res = await api.post('/products', data)
    return res.data
  },

  update: async (id: number, data: ProductUpdate): Promise<Product> => {
    const res = await api.patch(`/products/${id}`, data)
    return res.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`)
  },

  getRecipe: async (id: number): Promise<RecipeItem[]> => {
    const res = await api.get(`/products/${id}/recipe`)
    return res.data
  },

  addRecipeItem: async (id: number, data: RecipeItemCreate): Promise<RecipeItem> => {
    const res = await api.post(`/products/${id}/recipe`, data)
    return res.data
  },

  removeRecipeItem: async (productId: number, recipeItemId: number): Promise<void> => {
    await api.delete(`/products/${productId}/recipe/${recipeItemId}`)
  },
}