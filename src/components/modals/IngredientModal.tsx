import { useState } from 'react'
import type { Ingredient, IngredientCreate, IngredientUpdate, IngredientUnit } from '../../types'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { useCreateIngredient, useUpdateIngredient } from '../../hooks/useIngredients'

interface IngredientModalProps {
  ingredient?: Ingredient
  onClose: () => void
}

const units: IngredientUnit[] = ['kg', 'g', 'l', 'ml', 'unidad']

export function IngredientModal({ ingredient, onClose }: IngredientModalProps) {
  const isEditing = !!ingredient

  const [form, setForm] = useState({
    name: ingredient?.name ?? '',
    unit: ingredient?.unit ?? 'unidad' as IngredientUnit,
    stock_quantity: ingredient?.stock_quantity?.toString() ?? '0',
    stock_min_alert: ingredient?.stock_min_alert?.toString() ?? '0',
    is_allergen: ingredient?.is_allergen ?? false,
  })
  const [error, setError] = useState('')

  const createIngredient = useCreateIngredient()
  const updateIngredient = useUpdateIngredient()
  const isPending = createIngredient.isPending || updateIngredient.isPending

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError('El nombre es obligatorio')
      return
    }
    setError('')

    if (isEditing) {
      const data: IngredientUpdate = {
        name: form.name.trim(),
        unit: form.unit,
        stock_quantity: parseFloat(form.stock_quantity),
        stock_min_alert: parseFloat(form.stock_min_alert),
        is_allergen: form.is_allergen,
      }
      updateIngredient.mutate(
        { id: ingredient.id, data },
        { onSuccess: onClose, onError: () => setError('Error al actualizar el ingrediente') }
      )
    } else {
      const data: IngredientCreate = {
        name: form.name.trim(),
        unit: form.unit,
        stock_quantity: parseFloat(form.stock_quantity),
        stock_min_alert: parseFloat(form.stock_min_alert),
        is_allergen: form.is_allergen,
      }
      createIngredient.mutate(data, {
        onSuccess: onClose,
        onError: () => setError('Ya existe un ingrediente con ese nombre'),
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar ingrediente' : 'Nuevo ingrediente'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-sm text-gray-600 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Harina"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Unidad</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value as IngredientUnit })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {units.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Stock actual</label>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.001"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Alerta mínimo</label>
              <input
                type="number"
                value={form.stock_min_alert}
                onChange={(e) => setForm({ ...form, stock_min_alert: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.001"
              />
            </div>

          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_allergen"
              checked={form.is_allergen}
              onChange={(e) => setForm({ ...form, is_allergen: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="is_allergen" className="text-sm text-gray-600">
              Es alérgeno
            </label>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={isEditing ? 'Guardar cambios' : 'Crear ingrediente'}
            onClick={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}