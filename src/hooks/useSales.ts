import { useQuery, useMutation } from '@tanstack/react-query'
import { salesApi } from '../api/sales'
import type { PaymentStatusUpdate, PaymentCreate } from '../types'
import { queryClient } from '../api/client'

export function useSalesSummary() {
  return useQuery({
    queryKey: ['sales', 'summary'],
    queryFn: () => salesApi.getSummary(),
  })
}

export function usePayments(status?: string) {
  return useQuery({
    queryKey: ['sales', 'payments', status],
    queryFn: () => salesApi.getPayments(status),
  })
}

export function useUpdatePaymentStatus() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PaymentStatusUpdate }) =>
      salesApi.updatePaymentStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
    },
  })
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (data: PaymentCreate) => salesApi.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] })
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}