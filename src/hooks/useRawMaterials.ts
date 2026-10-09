import { useQuery, useMutation } from '@tanstack/react-query'
import { rawMaterialsApi } from '../api/rawMaterials'
import { queryClient } from '../api/queryClient'
import type { RawMaterialCreate, RawMaterialUpdate } from '../types'

export function useRawMaterials(includeInactive = false) {
  return useQuery({
    queryKey: ['raw-materials', includeInactive],
    queryFn: () => rawMaterialsApi.getAll(includeInactive),
  })
}

export function useCreateRawMaterial() {
  return useMutation({
    mutationFn: (data: RawMaterialCreate) => rawMaterialsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['raw-materials'] }),
  })
}

export function useUpdateRawMaterial() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RawMaterialUpdate }) =>
      rawMaterialsApi.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['raw-materials'] }),
  })
}

export function useDeleteRawMaterial() {
  return useMutation({
    mutationFn: (id: number) => rawMaterialsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['raw-materials'] }),
  })
}