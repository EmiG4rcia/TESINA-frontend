import { useState } from 'react'
import { useScheduledOrders, useDeleteScheduledOrder, useUpdateScheduledOrder } from '../hooks/useScheduledOrders'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, IconButton } from '../components/buttons'
import { ScheduledOrderModal } from '../components/modals/ScheduledOrderModal'
import type { ScheduledOrder } from '../types'

export function ScheduledOrdersPage() {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<ScheduledOrder | undefined>()

  const { data: orders, isLoading } = useScheduledOrders()
  const deleteOrder = useDeleteScheduledOrder()
  const updateOrder = useUpdateScheduledOrder()

  const handleEdit = (order: ScheduledOrder) => {
    setEditing(order)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditing(undefined)
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este pedido agendado?')) {
      deleteOrder.mutate(id)
    }
  }

  const handleComplete = (id: number) => {
    updateOrder.mutate({ id, data: { status: 'completed' } })
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Agenda de Pedidos" />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <PrimaryButton label="+ Nuevo pedido agendado" onClick={() => setShowModal(true)} />
        </div>

        <div className="space-y-3">
          {orders?.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
              No hay pedidos agendados
            </div>
          ) : (
            orders?.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-800">{order.destination_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      📅 {new Date(order.scheduled_date).toLocaleDateString('es-AR', {
                        weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                      })}
                    </p>
                    {order.notes && (
                      <p className="text-xs text-gray-400 mt-1">{order.notes}</p>
                    )}
                    {order.items.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {order.items.map((item) => (
                          <span key={item.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {item.product_name}: {item.planned_quantity} {item.product_unit}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleComplete(order.id)}
                        className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        ✓ Completar
                      </button>
                    )}
                    <IconButton
                      icon={<span className="text-sm">✏️</span>}
                      onClick={() => handleEdit(order)}
                      tooltip="Editar"
                    />
                    <IconButton
                      icon={<span className="text-sm">🗑️</span>}
                      onClick={() => handleDelete(order.id)}
                      tooltip="Eliminar"
                      variant="danger"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {showModal && (
        <ScheduledOrderModal order={editing} onClose={handleClose} />
      )}
    </div>
  )
}