import { useState } from 'react'
import type { Delivery, DeliveryCreate, DeliveryProductCreate } from '../../types'
import { PrimaryButton, SecondaryButton, IconButton } from '../buttons'
import { useCreateDelivery, useUpdateDelivery } from '../../hooks/useDeliveries'
import { useDestinations } from '../../hooks/useDestinations'
import { useProducts } from '../../hooks/useProducts'
import { useScheduledOrders } from '../../hooks/useScheduledOrders'

interface Props {
  delivery?: Delivery
  onClose: () => void
}

interface ProductRow {
  product_id: number
  product_name: string
  product_unit: string
  planned_quantity: number
  actual_quantity: number
}

export function DeliveryModal({ delivery, onClose }: Props) {
  const isEditing = !!delivery
  const today = new Date().toISOString().split('T')[0]

  const [destinationId, setDestinationId] = useState(delivery?.destination_id?.toString() ?? '')
  const [deliveryDate, setDeliveryDate] = useState(delivery?.delivery_date ?? today)
  const [deliveryTime, setDeliveryTime] = useState(delivery?.delivery_time ?? '')
  const [scheduledOrderId, setScheduledOrderId] = useState(delivery?.scheduled_order_id?.toString() ?? '')
  const [notes, setNotes] = useState(delivery?.notes ?? '')
  const [products, setProductRows] = useState<ProductRow[]>(
    delivery?.products.map((p) => ({
      product_id: p.product_id,
      product_name: p.product_name ?? '',
      product_unit: p.product_unit ?? '',
      planned_quantity: p.planned_quantity ?? 0,
      actual_quantity: p.actual_quantity ?? p.planned_quantity ?? 0,
    })) ?? []
  )
  const [selectedProductId, setSelectedProductId] = useState('')
  const [productQty, setProductQty] = useState('')
  const [error, setError] = useState('')

  const { data: destinations } = useDestinations()
  const { data: allProducts } = useProducts()
  const { data: scheduledOrders } = useScheduledOrders(
    destinationId ? { destination_id: parseInt(destinationId), status: 'pending' } : undefined
  )
  const create = useCreateDelivery()
  const update = useUpdateDelivery()
  const isPending = create.isPending || update.isPending

  const handleLoadFromScheduled = () => {
    if (!scheduledOrderId) return
    const order = scheduledOrders?.find((o) => o.id === parseInt(scheduledOrderId))
    if (!order) return
    setProductRows(order.items.map((i) => ({
      product_id: i.product_id,
      product_name: i.product_name ?? '',
      product_unit: i.product_unit ?? '',
      planned_quantity: i.planned_quantity,
      actual_quantity: i.planned_quantity,
    })))
  }

  const handleAddProduct = () => {
    if (!selectedProductId || !productQty) return
    const product = allProducts?.find((p) => p.id === parseInt(selectedProductId))
    if (!product) return
    if (products.find((p) => p.product_id === product.id)) {
      setError('Este producto ya fue agregado')
      return
    }
    setProductRows([...products, {
      product_id: product.id,
      product_name: product.name,
      product_unit: product.unit,
      planned_quantity: parseFloat(productQty),
      actual_quantity: parseFloat(productQty),
    }])
    setSelectedProductId('')
    setProductQty('')
    setError('')
  }

  const handleSubmit = () => {
    if (!destinationId) { setError('Seleccioná un destino'); return }
    if (!deliveryDate) { setError('Seleccioná una fecha'); return }
    setError('')

    if (isEditing) {
      update.mutate(
        {
          id: delivery.id,
          data: {
            delivery_time: deliveryTime || undefined,
            notes: notes || undefined,
          }
        },
        { onSuccess: onClose, onError: () => setError('Error al actualizar') }
      )
    } else {
      const data: DeliveryCreate = {
        destination_id: parseInt(destinationId),
        scheduled_order_id: scheduledOrderId ? parseInt(scheduledOrderId) : undefined,
        delivery_date: deliveryDate,
        delivery_time: deliveryTime || undefined,
        notes: notes || undefined,
        products: products.map((p) => ({
          product_id: p.product_id,
          planned_quantity: p.planned_quantity,
          actual_quantity: p.actual_quantity,
        } as DeliveryProductCreate)),
      }
      create.mutate(data, { onSuccess: onClose, onError: () => setError('Ya existe una entrega para ese destino en esa fecha') })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar entrega' : 'Nueva entrega'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Destino *</label>
              <select
                value={destinationId}
                onChange={(e) => { setDestinationId(e.target.value); setScheduledOrderId('') }}
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
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                disabled={isEditing}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Hora (opcional)</label>
            <input
              type="time"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {!isEditing && destinationId && scheduledOrders && scheduledOrders.length > 0 && (
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-3">
              <p className="text-xs font-medium text-blue-700 mb-2">Cargar desde pedido agendado</p>
              <div className="flex gap-2">
                <select
                  value={scheduledOrderId}
                  onChange={(e) => setScheduledOrderId(e.target.value)}
                  className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                >
                  <option value="">Seleccionar pedido agendado</option>
                  {scheduledOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {new Date(o.scheduled_date).toLocaleDateString('es-AR')}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleLoadFromScheduled}
                  className="text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Cargar
                </button>
              </div>
            </div>
          )}

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

              {products.length > 0 && (
                <div className="space-y-1 mb-3">
                  {products.map((p) => (
                    <div key={p.product_id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                      <span className="text-gray-700">{p.product_name}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={p.actual_quantity}
                          onChange={(e) => setProductRows(products.map((r) =>
                            r.product_id === p.product_id
                              ? { ...r, actual_quantity: parseFloat(e.target.value) }
                              : r
                          ))}
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-xs"
                          min="0"
                          step="0.001"
                        />
                        <span className="text-gray-400 text-xs">{p.product_unit}</span>
                        <IconButton
                          icon={<span className="text-xs">✕</span>}
                          onClick={() => setProductRows(products.filter((r) => r.product_id !== p.product_id))}
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
                  <option value="">Agregar producto</option>
                  {allProducts?.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={productQty}
                  onChange={(e) => setProductQty(e.target.value)}
                  placeholder="Cant."
                  className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.001"
                />
                <PrimaryButton label="+" onClick={handleAddProduct} size="sm" />
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={isEditing ? 'Guardar cambios' : 'Crear entrega'}
            onClick={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}