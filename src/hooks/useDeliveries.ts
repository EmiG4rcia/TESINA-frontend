import { useQuery, useMutation } from '@tanstack/react-query'
import { deliveriesApi } from '../api/deliveries'
import { queryClient } from '../api/queryClient'
import type { DeliveryCreate, DeliveryUpdate } from '../types'

export function useDeliveries(params?: {
  destination_id?: number
  date_from?: string
  date_to?: string
  status?: string
}) {
  return useQuery({
    queryKey: ['deliveries', params],
    queryFn: () => deliveriesApi.getAll(params),
  })
}

export function useCreateDelivery() {
  return useMutation({
    mutationFn: (data: DeliveryCreate) => deliveriesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useCompleteDelivery() {
  return useMutation({
    mutationFn: (id: number) => deliveriesApi.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deliveries'] })
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['stock'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}

export function useUpdateDelivery() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DeliveryUpdate }) =>
      deliveriesApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deliveries'] }),
  })
}

export function useDeleteDelivery() {
  return useMutation({
    mutationFn: (id: number) => deliveriesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['deliveries'] }),
  })
}