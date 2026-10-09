import { useState } from 'react'
import type { Destination, DestinationCreate, DestinationUpdate } from '../../types'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { useCreateDestination, useUpdateDestination } from '../../hooks/useDestinations'

interface Props {
  item?: Destination
  onClose: () => void
}

export function DestinationModal({ item, onClose }: Props) {
  const isEditing = !!item
  const [form, setForm] = useState({
    name: item?.name ?? '',
    address: item?.address ?? '',
    contact: item?.contact ?? '',
  })
  const [error, setError] = useState('')

  const create = useCreateDestination()
  const update = useUpdateDestination()
  const isPending = create.isPending || update.isPending

  const handleSubmit = () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return }
    setError('')

    if (isEditing) {
      const data: DestinationUpdate = {
        name: form.name,
        address: form.address || undefined,
        contact: form.contact || undefined,
      }
      update.mutate({ id: item.id, data }, { onSuccess: onClose, onError: () => setError('Error al actualizar') })
    } else {
      const data: DestinationCreate = {
        name: form.name,
        address: form.address || undefined,
        contact: form.contact || undefined,
      }
      create.mutate(data, { onSuccess: onClose, onError: () => setError('Ya existe un destino con ese nombre') })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar destino' : 'Nuevo destino'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Supermercado Norte"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Dirección</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opcional"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Contacto</label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Teléfono o nombre"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={isEditing ? 'Guardar cambios' : 'Crear'}
            onClick={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}