import { useState } from 'react'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { useCreateOrder } from '../../hooks/useOrders'
import { useMenu } from '../../hooks/useMenu'
import { useCustomers } from '../../hooks/useCustomers'
import { useTables } from '../../hooks/useTables'
import type { OrderItemCreate } from '../../types'

interface OrderCreateModalProps {
  onClose: () => void
}

interface CartItem extends OrderItemCreate {
  name: string
}

export function OrderCreateModal({ onClose }: OrderCreateModalProps) {
  const [customerId, setCustomerId] = useState<number | ''>('')
  const [tableId, setTableId] = useState<number | ''>('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [error, setError] = useState('')

  const { data: menuItems } = useMenu()
  const { data: customers } = useCustomers()
  const { data: tables } = useTables()
  const createOrder = useCreateOrder()

  const addItem = (menuItemId: number) => {
    const menuItem = menuItems?.find((i) => i.id === menuItemId)
    if (!menuItem) return

    const existing = cart.find((i) => i.menu_item_id === menuItemId)
    if (existing) {
      setCart(cart.map((i) =>
        i.menu_item_id === menuItemId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ))
    } else {
      setCart([...cart, {
        menu_item_id: menuItemId,
        quantity: 1,
        unit_price: Number(menuItem.price),
        name: menuItem.name ?? '',
      }])
    }
  }

  const removeItem = (menuItemId: number) => {
    setCart(cart.filter((i) => i.menu_item_id !== menuItemId))
  }

  const total = cart.reduce((sum, i) => sum + i.unit_price * i.quantity, 0)

  const handleSubmit = () => {
    if (cart.length === 0) {
      setError('Agregá al menos un item al pedido')
      return
    }
    setError('')

    createOrder.mutate(
      {
        customer_id: customerId || undefined,
        table_id: tableId || undefined,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        items: cart.map(({ name, ...item }) => item),
      },
      { onSuccess: onClose, onError: () => setError('Error al crear el pedido') }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Nuevo pedido</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cliente</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value ? Number(e.target.value) : '')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin cliente</option>
                {customers?.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name ?? c.phone_number}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Mesa</label>
              <select
                value={tableId}
                onChange={(e) => setTableId(e.target.value ? Number(e.target.value) : '')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sin mesa</option>
                {tables?.map((t) => (
                  <option key={t.id} value={t.id}>Mesa {t.table_number}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Agregar items</label>
            <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {menuItems?.filter((i) => i.is_available).map((item) => (
                <button
                  key={item.id}
                  onClick={() => addItem(item.id)}
                  className="flex justify-between items-center px-3 py-2 text-sm rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors text-left"
                >
                  <span>{item.name}</span>
                  <span className="text-gray-500">${item.price}</span>
                </button>
              ))}
            </div>
          </div>

          {cart.length > 0 && (
            <div>
              <label className="block text-sm text-gray-600 mb-2">Carrito</label>
              <div className="space-y-1">
                {cart.map((item) => (
                  <div
                    key={item.menu_item_id}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm"
                  >
                    <span className="text-gray-700">
                      {item.name} x{item.quantity}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.menu_item_id)}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between px-3 py-2 font-medium text-sm border-t border-gray-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label="Crear pedido"
            onClick={handleSubmit}
            isLoading={createOrder.isPending}
          />
        </div>
      </div>
    </div>
  )
}