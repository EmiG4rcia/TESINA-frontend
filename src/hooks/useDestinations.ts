import { useQuery, useMutation } from '@tanstack/react-query'
import { destinationsApi } from '../api/destinations'
import { queryClient } from '../api/queryClient'
import type { DestinationCreate, DestinationUpdate } from '../types'

export function useDestinations(includeInactive = false) {
  return useQuery({
    queryKey: ['destinations', includeInactive],
    queryFn: () => destinationsApi.getAll(includeInactive),
  })
}

export function useCreateDestination() {
  return useMutation({
    mutationFn: (data: DestinationCreate) => destinationsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['destinations'] }),
  })
}

export function useUpdateDestination() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: DestinationUpdate }) =>
      destinationsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['destinations'] }),
  })
}

export function useDeleteDestination() {
  return useMutation({
    mutationFn: (id: number) => destinationsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['destinations'] }),
  })
}