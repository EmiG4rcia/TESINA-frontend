import { useState } from 'react'
import type { ScheduledOrder, ScheduledOrderCreate, ScheduledOrderItemCreate } from '../../types'
import { PrimaryButton, SecondaryButton, IconButton } from '../buttons'
import { useCreateScheduledOrder, useUpdateScheduledOrder } from '../../hooks/useScheduledOrders'
import { useDestinations } from '../../hooks/useDestinations'
import { useProducts } from '../../hooks/useProducts'

interface Props {
  order?: ScheduledOrder
  onClose: () => void
}

interface ItemRow {
  product_id: number
  product_name: string
  product_unit: string
  planned_quantity: number
}

export function ScheduledOrderModal({ order, onClose }: Props) {
  const isEditing = !!order
  const [destinationId, setDestinationId] = useState(order?.destination_id?.toString() ?? '')
  const [scheduledDate, setScheduledDate] = useState(order?.scheduled_date ?? '')
  const [notes, setNotes] = useState(order?.notes ?? '')
  const [items, setItems] = useState<ItemRow[]>(
    order?.items.map((i) => ({
      product_id: i.product_id,
      product_name: i.product_name ?? '',
      product_unit: i.product_unit ?? '',
      planned_quantity: i.planned_quantity,
    })) ?? []
  )
  const [selectedProductId, setSelectedProductId] = useState('')
  const [itemQty, setItemQty] = useState('')
  const [error, setError] = useState('')

  const { data: destinations } = useDestinations()
  const { data: products } = useProducts()
  const create = useCreateScheduledOrder()
  const update = useUpdateScheduledOrder()
  const isPending = create.isPending || update.isPending

  const handleAddItem = () => {
    if (!selectedProductId || !itemQty) return
    const product = products?.find((p) => p.id === parseInt(selectedProductId))
    if (!product) return
    if (items.find((i) => i.product_id === product.id)) {
      setError('Este producto ya fue agregado')
      return
    }
    setItems([...items, {
      product_id: product.id,
      product_name: product.name,
      product_unit: product.unit,
      planned_quantity: parseFloat(itemQty),
    }])
    setSelectedProductId('')
    setItemQty('')
    setError('')
  }

  const handleSubmit = () => {
    if (!destinationId) { setError('Seleccioná un destino'); return }
    if (!scheduledDate) { setError('Seleccioná una fecha'); return }
    setError('')

    if (isEditing) {
      update.mutate(
        { id: order.id, data: { scheduled_date: scheduledDate, notes: notes || undefined } },
        { onSuccess: onClose, onError: () => setError('Error al actualizar') }
      )
    } else {
      const data: ScheduledOrderCreate = {
        destination_id: parseInt(destinationId),
        scheduled_date: scheduledDate,
        notes: notes || undefined,
        items: items.map((item) => ({
            product_id: item.product_id,
            planned_quantity: item.planned_quantity,
        } as ScheduledOrderItemCreate)),
      }
      create.mutate(data, { onSuccess: onClose, onError: () => setError('Ya existe un pedido para ese destino en esa fecha') })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar pedido agendado' : 'Nuevo pedido agendado'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Destino *</label>
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                disabled={isEditing}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                <option value="">Seleccionar</option>
                {destinations?.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha *</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Notas</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Opcional"
            />
          </div>

          {!isEditing && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Productos</p>

              {items.length > 0 && (
                <div className="space-y-1 mb-3">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                      <span className="text-gray-700">{item.product_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs">{item.planned_quantity} {item.product_unit}</span>
                        <IconButton
                          icon={<span className="text-xs">✕</span>}
                          onClick={() => setItems(items.filter((i) => i.product_id !== item.product_id))}
                          tooltip="Quitar"
                          variant="danger"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar producto</option>
                  {products?.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={itemQty}
                  onChange={(e) => setItemQty(e.target.value)}
                  placeholder="Cant."
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.001"
                />
                <PrimaryButton label="+" onClick={handleAddItem} size="sm" />
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={isEditing ? 'Guardar cambios' : 'Crear pedido'}
            onClick={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}