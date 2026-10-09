import { useState } from 'react'
import type { RawMaterial, RawMaterialCreate, RawMaterialUpdate, UnitType } from '../../types'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { useCreateRawMaterial, useUpdateRawMaterial } from '../../hooks/useRawMaterials'

interface Props {
  item?: RawMaterial
  onClose: () => void
}

const units: UnitType[] = ['kg', 'g', 'l', 'ml', 'unidad']

export function RawMaterialModal({ item, onClose }: Props) {
  const isEditing = !!item
  const [form, setForm] = useState({
    name: item?.name ?? '',
    unit: item?.unit ?? 'kg' as UnitType,
    stock_quantity: item?.stock_quantity?.toString() ?? '0',
    stock_min_alert: item?.stock_min_alert?.toString() ?? '0',
    alert_enabled: item?.alert_enabled ?? true,
  })
  const [error, setError] = useState('')

  const create = useCreateRawMaterial()
  const update = useUpdateRawMaterial()
  const isPending = create.isPending || update.isPending

  const handleSubmit = () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return }
    setError('')

    if (isEditing) {
      const data: RawMaterialUpdate = {
        name: form.name,
        unit: form.unit,
        stock_quantity: parseFloat(form.stock_quantity),
        stock_min_alert: parseFloat(form.stock_min_alert),
        alert_enabled: form.alert_enabled,
      }
      update.mutate({ id: item.id, data }, { onSuccess: onClose, onError: () => setError('Error al actualizar') })
    } else {
      const data: RawMaterialCreate = {
        name: form.name,
        unit: form.unit,
        stock_quantity: parseFloat(form.stock_quantity),
        stock_min_alert: parseFloat(form.stock_min_alert),
        alert_enabled: form.alert_enabled,
      }
      create.mutate(data, { onSuccess: onClose, onError: () => setError('Ya existe una materia prima con ese nombre') })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar materia prima' : 'Nueva materia prima'}
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
              placeholder="Ej: Supremas de pollo"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Unidad *</label>
              <select
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value as UnitType })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {units.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Stock actual</label>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0" step="0.001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Stock mínimo de alerta</label>
            <input
              type="number"
              value={form.stock_min_alert}
              onChange={(e) => setForm({ ...form, stock_min_alert: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0" step="0.001"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="alert_enabled"
              checked={form.alert_enabled}
              onChange={(e) => setForm({ ...form, alert_enabled: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="alert_enabled" className="text-sm text-gray-600">
              Activar alerta de stock bajo
            </label>
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