import { useQuery, useMutation } from '@tanstack/react-query'
import { stockApi } from '../api/stock'
import { queryClient } from '../api/queryClient'
import type { StockPurchase, StockAdjustment } from '../types'

export function useStockMovements(itemType?: string, itemId?: number) {
  return useQuery({
    queryKey: ['stock', itemType, itemId],
    queryFn: () => stockApi.getMovements(itemType, itemId),
  })
}

export function usePurchaseStock() {
  return useMutation({
    mutationFn: (data: StockPurchase) => stockApi.purchase(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['raw-materials'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useAdjustStock() {
  return useMutation({
    mutationFn: (data: StockAdjustment) => stockApi.adjust(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['raw-materials'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}