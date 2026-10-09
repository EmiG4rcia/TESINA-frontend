import { useQuery, useMutation } from '@tanstack/react-query'
import { productsApi } from '../api/products'
import { queryClient } from '../api/queryClient'
import type { ProductCreate, ProductUpdate, RecipeItemCreate } from '../types'

export function useProducts(includeInactive = false) {
  return useQuery({
    queryKey: ['products', includeInactive],
    queryFn: () => productsApi.getAll(includeInactive),
  })
}

export function useProductRecipe(productId: number) {
  return useQuery({
    queryKey: ['products', productId, 'recipe'],
    queryFn: () => productsApi.getRecipe(productId),
    enabled: !!productId,
  })
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: (data: ProductCreate) => productsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useUpdateProduct() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdate }) =>
      productsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useDeleteProduct() {
  return useMutation({
    mutationFn: (id: number) => productsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  })
}

export function useAddRecipeItem() {
  return useMutation({
    mutationFn: ({ productId, data }: { productId: number; data: RecipeItemCreate }) =>
      productsApi.addRecipeItem(productId, data),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId, 'recipe'] }),
  })
}

export function useRemoveRecipeItem() {
  return useMutation({
    mutationFn: ({ productId, recipeItemId }: { productId: number; recipeItemId: number }) =>
      productsApi.removeRecipeItem(productId, recipeItemId),
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({ queryKey: ['products', variables.productId, 'recipe'] }),
  })
}