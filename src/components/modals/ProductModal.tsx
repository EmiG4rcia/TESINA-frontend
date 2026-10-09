import { useState } from 'react'
import type { Product, ProductCreate, ProductUpdate, UnitType, RecipeItemCreate } from '../../types'
import { PrimaryButton, SecondaryButton, IconButton } from '../buttons'
import { useCreateProduct, useUpdateProduct, useProductRecipe, useAddRecipeItem, useRemoveRecipeItem } from '../../hooks/useProducts'
import { useRawMaterials } from '../../hooks/useRawMaterials'

interface Props {
  item?: Product
  onClose: () => void
}

const units: UnitType[] = ['kg', 'g', 'l', 'ml', 'unidad']

export function ProductModal({ item, onClose }: Props) {
  const isEditing = !!item
  const [form, setForm] = useState({
    name: item?.name ?? '',
    unit: item?.unit ?? 'unidad' as UnitType,
    stock_quantity: item?.stock_quantity?.toString() ?? '0',
    stock_min_alert: item?.stock_min_alert?.toString() ?? '0',
    alert_enabled: item?.alert_enabled ?? true,
  })
  const [error, setError] = useState('')
  const [selectedRmId, setSelectedRmId] = useState('')
  const [recipeQty, setRecipeQty] = useState('')
  const [recipeUnit, setRecipeUnit] = useState('kg')
  const [recipeYield, setRecipeYield] = useState('1')

  const create = useCreateProduct()
  const update = useUpdateProduct()
  const { data: recipe, refetch } = useProductRecipe(item?.id ?? 0)
  const { data: rawMaterials } = useRawMaterials()
  const addRecipeItem = useAddRecipeItem()
  const removeRecipeItem = useRemoveRecipeItem()
  const isPending = create.isPending || update.isPending

  const handleSubmit = () => {
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return }
    setError('')

    if (isEditing) {
      const data: ProductUpdate = {
        name: form.name,
        unit: form.unit,
        stock_quantity: parseFloat(form.stock_quantity),
        stock_min_alert: parseFloat(form.stock_min_alert),
        alert_enabled: form.alert_enabled,
      }
      update.mutate({ id: item.id, data }, { onSuccess: onClose, onError: () => setError('Error al actualizar') })
    } else {
      const data: ProductCreate = {
        name: form.name,
        unit: form.unit,
        stock_quantity: parseFloat(form.stock_quantity),
        stock_min_alert: parseFloat(form.stock_min_alert),
        alert_enabled: form.alert_enabled,
      }
      create.mutate(data, { onSuccess: onClose, onError: () => setError('Ya existe un producto con ese nombre') })
    }
  }

  const handleAddRecipe = () => {
    if (!item?.id || !selectedRmId || !recipeQty) return
    const data: RecipeItemCreate = {
      raw_material_id: parseInt(selectedRmId),
      estimated_quantity: parseFloat(recipeQty),
      unit: recipeUnit,
      yield_quantity: parseFloat(recipeYield),
    }
    addRecipeItem.mutate(
      { productId: item.id, data },
      {
        onSuccess: () => {
          setSelectedRmId('')
          setRecipeQty('')
          setRecipeYield('1')
          refetch()
        }
      }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Milanesas de pollo"
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
              id="alert_enabled_product"
              checked={form.alert_enabled}
              onChange={(e) => setForm({ ...form, alert_enabled: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="alert_enabled_product" className="text-sm text-gray-600">
              Activar alerta de stock bajo
            </label>
          </div>

          {isEditing && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Receta estimada</p>

              {recipe && recipe.length > 0 ? (
                <div className="space-y-1 mb-3">
                  {recipe.map((r) => (
                    <div key={r.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                      <span className="text-gray-700">{r.raw_material_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">
                          {r.estimated_quantity} {r.unit} → rinde {r.yield_quantity} {item?.unit}
                        </span>
                        <IconButton
                          icon={<span className="text-xs">✕</span>}
                          onClick={() => removeRecipeItem.mutate(
                            { productId: item.id, recipeItemId: r.id },
                            { onSuccess: () => refetch() }
                          )}
                          tooltip="Quitar"
                          variant="danger"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-3">Sin ingredientes en la receta</p>
              )}

              <div className="flex gap-2 flex-wrap">
                <select
                  value={selectedRmId}
                  onChange={(e) => setSelectedRmId(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Materia prima</option>
                  {rawMaterials?.map((rm) => (
                    <option key={rm.id} value={rm.id}>{rm.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={recipeQty}
                  onChange={(e) => setRecipeQty(e.target.value)}
                  placeholder="Cantidad"
                  title="Cantidad de materia prima usada"
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0" step="0.001"
                />
                <select
                  value={recipeUnit}
                  onChange={(e) => setRecipeUnit(e.target.value)}
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {units.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
                <input
                  type="number"
                  value={recipeYield}
                  onChange={(e) => setRecipeYield(e.target.value)}
                  placeholder="Rinde"
                  title="Cantidad de producto final que rinde"
                  className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0.001" step="0.001"
                />
                <PrimaryButton label="+" onClick={handleAddRecipe} size="sm" />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {recipeQty || 'X'} {recipeUnit} de materia prima rinde {recipeYield} {item?.unit} de {item?.name}
              </p>
            </div>
          )}

          {!isEditing && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <p className="text-xs text-blue-600">
                💡 Después de crear el producto podrás agregar su receta editándolo.
              </p>
            </div>
          )}

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