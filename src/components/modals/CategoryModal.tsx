import { useState } from 'react'
import type { Category, CategoryCreate, CategoryUpdate } from '../../types'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { useCreateCategory, useUpdateCategory } from '../../hooks/useCategories'

interface CategoryModalProps {
  category?: Category
  onClose: () => void
}

export function CategoryModal({ category, onClose }: CategoryModalProps) {
  const isEditing = !!category
  const [name, setName] = useState(category?.name ?? '')
  const [error, setError] = useState('')

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const isPending = createCategory.isPending || updateCategory.isPending

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    setError('')

    if (isEditing) {
      const data: CategoryUpdate = { name: name.trim() }
      updateCategory.mutate(
        { id: category.id, data },
        {
          onSuccess: onClose,
          onError: () => setError('Ya existe una categoría con ese nombre'),
        }
      )
    } else {
      const data: CategoryCreate = { name: name.trim() }
      createCategory.mutate(data, {
        onSuccess: onClose,
        onError: () => setError('Ya existe una categoría con ese nombre'),
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar categoría' : 'Nueva categoría'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Hamburguesas"
              autoFocus
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={isEditing ? 'Guardar cambios' : 'Crear categoría'}
            onClick={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}