import { useQuery, useMutation } from '@tanstack/react-query'
import { productionApi } from '../api/production'
import { queryClient } from '../api/queryClient'
import type { ProductionLogCreate } from '../types'

export function useProductionLogs(productId?: number) {
  return useQuery({
    queryKey: ['production', productId],
    queryFn: () => productionApi.getAll(productId),
  })
}

export function useCreateProductionLog() {
  return useMutation({
    mutationFn: (data: ProductionLogCreate) => productionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['production'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['raw-materials'] })
      queryClient.invalidateQueries({ queryKey: ['stock'] })
    },
  })
}

export function useDeleteProductionLog() {
  return useMutation({
    mutationFn: (id: number) => productionApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['production'] }),
  })
}