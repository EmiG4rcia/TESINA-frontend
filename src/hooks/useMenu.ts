import { useQuery, useMutation } from '@tanstack/react-query'
import { menuApi } from '../api/menu'
import type { MenuItemCreate, MenuItemUpdate } from '../types'
import { queryClient } from '../api/client'

export function useMenu() {
  return useQuery({
    queryKey: ['menu'],
    queryFn: () => menuApi.getAll(),
  })
}

export function useCreateMenuItem() {
  return useMutation({
    mutationFn: (data: MenuItemCreate) => menuApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
    },
  })
}

export function useUpdateMenuItem() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MenuItemUpdate }) =>
      menuApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
    },
  })
}

export function useDeleteMenuItem() {
  return useMutation({
    mutationFn: (id: number) => menuApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
    },
  })
}

export function useToggleAvailability() {
  return useMutation({
    mutationFn: (id: number) => menuApi.toggleAvailability(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menu'] })
    },
  })
}