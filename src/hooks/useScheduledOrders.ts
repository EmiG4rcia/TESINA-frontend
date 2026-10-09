import { useQuery, useMutation } from '@tanstack/react-query'
import { scheduledOrdersApi } from '../api/scheduledOrders'
import { queryClient } from '../api/queryClient'
import type { ScheduledOrderCreate, ScheduledOrderUpdate, ScheduledOrderItemUpdate } from '../types'

export function useScheduledOrders(params?: {
  destination_id?: number
  date_from?: string
  date_to?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['scheduled-orders', params],
    queryFn: () => scheduledOrdersApi.getAll(params),
  })
}

export function useCreateScheduledOrder() {
  return useMutation({
    mutationFn: (data: ScheduledOrderCreate) => scheduledOrdersApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scheduled-orders'] }),
  })
}

export function useUpdateScheduledOrder() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ScheduledOrderUpdate }) =>
      scheduledOrdersApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scheduled-orders'] }),
  })
}

export function useUpdateScheduledOrderItem() {
  return useMutation({
    mutationFn: ({ orderId, itemId, data }: {
      orderId: number
      itemId: number
      data: ScheduledOrderItemUpdate
    }) => scheduledOrdersApi.updateItem(orderId, itemId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scheduled-orders'] }),
  })
}

export function useDeleteScheduledOrder() {
  return useMutation({
    mutationFn: (id: number) => scheduledOrdersApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scheduled-orders'] }),
  })
}