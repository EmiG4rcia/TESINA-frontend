import { useState } from 'react'
import type { Customer, CustomerCreate, CustomerUpdate } from '../../types'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { useCreateCustomer, useUpdateCustomer } from '../../hooks/useCustomers'

interface CustomerModalProps {
  customer?: Customer
  onClose: () => void
}

export function CustomerModal({ customer, onClose }: CustomerModalProps) {
  const isEditing = !!customer

  const [form, setForm] = useState({
    phone_number: customer?.phone_number ?? '',
    name: customer?.name ?? '',
  })

  const [error, setError] = useState('')
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()
  const isPending = createCustomer.isPending || updateCustomer.isPending

  const handleSubmit = () => {
    if (!form.phone_number.trim()) {
      setError('El número de teléfono es obligatorio')
      return
    }
    setError('')

    if (isEditing) {
      const data: CustomerUpdate = {
        phone_number: form.phone_number,
        name: form.name || undefined,
      }
      updateCustomer.mutate(
        { id: customer.id, data },
        {
          onSuccess: onClose,
          onError: () => setError('Error al actualizar el cliente'),
        }
      )
    } else {
      const data: CustomerCreate = {
        phone_number: form.phone_number,
        name: form.name || undefined,
      }
      createCustomer.mutate(data, {
        onSuccess: onClose,
        onError: () => setError('Ya existe un cliente con ese número'),
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar cliente' : 'Nuevo cliente'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Número de teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+5492612000000"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre del cliente"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={isEditing ? 'Guardar cambios' : 'Crear cliente'}
            onClick={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}