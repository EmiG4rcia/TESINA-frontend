import { useQuery, useMutation } from '@tanstack/react-query'
import { customersApi } from '../api/customers'
import type { CustomerCreate, CustomerUpdate } from '../types'
import { queryClient } from '../api/client'

export function useCustomers(skip = 0, limit = 50) {
  return useQuery({
    queryKey: ['customers', skip, limit],
    queryFn: () => customersApi.getAll(skip, limit),
  })
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customersApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateCustomer() {
  return useMutation({
    mutationFn: (data: CustomerCreate) => customersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useUpdateCustomer() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CustomerUpdate }) =>
      customersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}

export function useDeleteCustomer() {
  return useMutation({
    mutationFn: (id: number) => customersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] })
    },
  })
}