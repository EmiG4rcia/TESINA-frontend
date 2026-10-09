import type { Order, OrderStatus } from '../../types'
import { Badge } from '../Badge'
import { SecondaryButton } from '../buttons'
import { useUpdateOrderStatus } from '../../hooks/useOrders'

interface OrderModalProps {
  order: Order
  onClose: () => void
}

const statusOptions: OrderStatus[] = [
  'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'
]

export function OrderModal({ order, onClose }: OrderModalProps) {
  const updateStatus = useUpdateOrderStatus()

  const handleStatusChange = (status: OrderStatus) => {
    updateStatus.mutate(
      { id: order.id, data: { status } },
      { onSuccess: onClose }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            Pedido #{order.id}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Cliente</p>
              <p className="font-medium text-gray-800">{order.customer_name ?? '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Mesa</p>
              <p className="font-medium text-gray-800">{order.table_number ?? '-'}</p>
            </div>
            <div>
              <p className="text-gray-500">Total</p>
              <p className="font-medium text-gray-800">
                ${order.total_amount ?? '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Estado</p>
              <Badge status={order.status} />
            </div>
          </div>

          {order.items.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Items del pedido</p>
              <div className="space-y-1">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg"
                  >
                    <span className="text-gray-700">
                      {item.item_name ?? `Item #${item.menu_item_id}`} x{item.quantity}
                    </span>
                    <span className="text-gray-600">${item.unit_price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500 mb-2">Cambiar estado</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={order.status === status || updateStatus.isPending}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                    ${order.status === status
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <Badge status={status} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cerrar" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}