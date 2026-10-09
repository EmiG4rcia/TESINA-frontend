import { useQuery, useMutation } from '@tanstack/react-query'
import { ingredientsApi } from '../api/ingredients'
import type { IngredientCreate, IngredientUpdate, MenuItemIngredientCreate } from '../types'
import { queryClient } from '../api/client'

export function useIngredients(includeInactive = false) {
  return useQuery({
    queryKey: ['ingredients', includeInactive],
    queryFn: () => ingredientsApi.getAll(includeInactive),
  })
}

export function useMenuItemIngredients(menuItemId: number) {
  return useQuery({
    queryKey: ['ingredients', 'menu-item', menuItemId],
    queryFn: () => ingredientsApi.getMenuItemIngredients(menuItemId),
    enabled: !!menuItemId,
  })
}

export function useCreateIngredient() {
  return useMutation({
    mutationFn: (data: IngredientCreate) => ingredientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}

export function useUpdateIngredient() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredientUpdate }) =>
      ingredientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}

export function useDeleteIngredient() {
  return useMutation({
    mutationFn: (id: number) => ingredientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredients'] })
    },
  })
}

export function useAddIngredientToMenuItem() {
  return useMutation({
    mutationFn: ({ menuItemId, data }: { menuItemId: number; data: MenuItemIngredientCreate }) =>
      ingredientsApi.addToMenuItem(menuItemId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ingredients', 'menu-item', variables.menuItemId],
      })
    },
  })
}

export function useRemoveIngredientFromMenuItem() {
  return useMutation({
    mutationFn: ({ menuItemId, ingredientId }: { menuItemId: number; ingredientId: number }) =>
      ingredientsApi.removeFromMenuItem(menuItemId, ingredientId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['ingredients', 'menu-item', variables.menuItemId],
      })
    },
  })
}