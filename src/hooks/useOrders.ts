import { useQuery, useMutation } from '@tanstack/react-query'
import { ordersApi } from '../api/orders'
import type { OrderFilters } from '../api/orders'
import type { OrderStatusUpdate, OrderCreate } from '../types'
import { queryClient } from '../api/client'

export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => ordersApi.getAll(filters),
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  })
}

export function useOrderSummary() {
  return useQuery({
    queryKey: ['orders', 'summary'],
    queryFn: () => ordersApi.getSummary(),
  })
}

export function useUpdateOrderStatus() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrderStatusUpdate }) =>
      ordersApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (data: OrderCreate) => ordersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}

export function useDeleteOrder() {
  return useMutation({
    mutationFn: (id: number) => ordersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}