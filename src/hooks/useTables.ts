import { useQuery, useMutation } from '@tanstack/react-query'
import { tablesApi } from '../api/tables'
import type { TableCreate, TableUpdate } from '../types'
import { queryClient } from '../api/client'

export function useTables() {
  return useQuery({
    queryKey: ['tables'],
    queryFn: () => tablesApi.getAll(),
  })
}

export function useTableQR(id: number) {
  return useQuery({
    queryKey: ['tables', id, 'qr'],
    queryFn: () => tablesApi.getQR(id),
    enabled: !!id,
  })
}

export function useCreateTable() {
  return useMutation({
    mutationFn: (data: TableCreate) => tablesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}

export function useUpdateTable() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TableUpdate }) =>
      tablesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}

export function useDeleteTable() {
  return useMutation({
    mutationFn: (id: number) => tablesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] })
    },
  })
}