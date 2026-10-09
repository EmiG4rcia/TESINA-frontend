import { useState } from 'react'
import type { MenuItem, MenuItemCreate, MenuItemUpdate, MenuItemIngredientCreate } from '../../types'
import { PrimaryButton, SecondaryButton, IconButton } from '../buttons'
import { useCreateMenuItem, useUpdateMenuItem } from '../../hooks/useMenu'
import { useCategories } from '../../hooks/useCategories'
import { useIngredients, useMenuItemIngredients, useAddIngredientToMenuItem, useRemoveIngredientFromMenuItem } from '../../hooks/useIngredients'
import { formatUnit } from '../../utils/format'

interface MenuItemModalProps {
  item?: MenuItem
  onClose: () => void
}

export function MenuItemModal({ item, onClose }: MenuItemModalProps) {
  const isEditing = !!item

  const [form, setForm] = useState({
    category_id: item?.category_id?.toString() ?? '',
    name: item?.name ?? '',
    description: item?.description ?? '',
    price: item?.price?.toString() ?? '',
    is_available: item?.is_available ?? true,
  })

  const [selectedIngredientId, setSelectedIngredientId] = useState('')
  const [ingredientQuantity, setIngredientQuantity] = useState('')
  const [linkError, setLinkError] = useState('')

  const { data: categories } = useCategories()
  const { data: allIngredients } = useIngredients()
  const { data: linkedIngredients, refetch: refetchLinked } = useMenuItemIngredients(item?.id ?? 0)

  const createItem = useCreateMenuItem()
  const updateItem = useUpdateMenuItem()
  const addIngredient = useAddIngredientToMenuItem()
  const removeIngredient = useRemoveIngredientFromMenuItem()

  const isPending = createItem.isPending || updateItem.isPending

  const handleSubmit = () => {
    if (!form.name || !form.price) return

    if (isEditing) {
      const data: MenuItemUpdate = {
        category_id: form.category_id ? parseInt(form.category_id) : undefined,
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        is_available: form.is_available,
      }
      updateItem.mutate({ id: item.id, data }, { onSuccess: onClose })
    } else {
      const data: MenuItemCreate = {
        category_id: form.category_id ? parseInt(form.category_id) : undefined,
        name: form.name,
        description: form.description || undefined,
        price: parseFloat(form.price),
        is_available: form.is_available,
      }
      createItem.mutate(data, { onSuccess: onClose })
    }
  }

  const handleAddIngredient = () => {
    if (!item?.id) {
      setLinkError('Guardá el producto primero antes de agregar ingredientes')
      return
    }
    if (!selectedIngredientId || !ingredientQuantity) {
      setLinkError('Seleccioná un ingrediente e ingresá la cantidad')
      return
    }
    setLinkError('')

    const data: MenuItemIngredientCreate = {
      ingredient_id: parseInt(selectedIngredientId),
      quantity_used: parseFloat(ingredientQuantity),
    }

    addIngredient.mutate(
      { menuItemId: item.id, data },
      {
        onSuccess: () => {
          setSelectedIngredientId('')
          setIngredientQuantity('')
          refetchLinked()
        },
        onError: () => setLinkError('Este ingrediente ya está asociado al producto'),
      }
    )
  }

  const handleRemoveIngredient = (ingredientId: number) => {
    if (!item?.id) return
    removeIngredient.mutate(
      { menuItemId: item.id, ingredientId },
      { onSuccess: () => refetchLinked() }
    )
  }

  const selectedIngredient = allIngredients?.find(
    (i) => i.id === parseInt(selectedIngredientId)
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar item' : 'Nuevo item'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Basic fields */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Categoría</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin categoría</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Nombre *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Smash Clásica"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Descripción opcional"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Precio *</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_available"
              checked={form.is_available}
              onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="is_available" className="text-sm text-gray-600">
              Disponible
            </label>
          </div>

          {/* Ingredients section — only shown when editing */}
          {isEditing && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Ingredientes del producto
              </p>

              {/* Linked ingredients list */}
              {linkedIngredients && linkedIngredients.length > 0 ? (
                <div className="space-y-1 mb-3">
                  {linkedIngredients.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm"
                    >
                      <span className="text-gray-700">{link.ingredient_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">
                          {parseFloat(String(link.quantity_used)).toLocaleString('es-AR', {
                            maximumFractionDigits: 3,
                          })} {formatUnit(link.ingredient_unit ?? '')}
                        </span>
                        <IconButton
                          icon={<span className="text-xs">✕</span>}
                          onClick={() => handleRemoveIngredient(link.ingredient_id)}
                          tooltip="Quitar ingrediente"
                          variant="danger"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-3">
                  Sin ingredientes asignados aún
                </p>
              )}

              {/* Add ingredient */}
              <div className="flex gap-2">
                <select
                  value={selectedIngredientId}
                  onChange={(e) => setSelectedIngredientId(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar ingrediente</option>
                  {allIngredients?.map((ing) => (
                    <option key={ing.id} value={ing.id}>
                      {ing.name} ({formatUnit(ing.unit)})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={ingredientQuantity}
                  onChange={(e) => setIngredientQuantity(e.target.value)}
                  placeholder={selectedIngredient ? formatUnit(selectedIngredient.unit) : 'Cant.'}
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.001"
                />
                <PrimaryButton
                  label="+"
                  onClick={handleAddIngredient}
                  isLoading={addIngredient.isPending}
                  size="sm"
                />
              </div>
              {linkError && <p className="text-xs text-red-500 mt-1">{linkError}</p>}
              {!item?.id && (
                <p className="text-xs text-gray-400 mt-2">
                  Los ingredientes se pueden asignar después de crear el producto
                </p>
              )}
            </div>
          )}

          {!isEditing && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <p className="text-xs text-blue-600">
                💡 Después de crear el producto podrás asignarle ingredientes editándolo.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={isEditing ? 'Guardar cambios' : 'Crear item'}
            onClick={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}