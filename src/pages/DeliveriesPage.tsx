import { useState } from 'react'
import { useDeliveries, useCompleteDelivery, useDeleteDelivery } from '../hooks/useDeliveries'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, IconButton } from '../components/buttons'
import { DeliveryModal } from '../components/modals/DeliveryModal'
import type { Delivery } from '../types'

export function DeliveriesPage() {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Delivery | undefined>()
  const [statusFilter, setStatusFilter] = useState<string>('')

  const { data: deliveries, isLoading } = useDeliveries(
    statusFilter ? { status: statusFilter } : undefined
  )
  const completeDelivery = useCompleteDelivery()
  const deleteDelivery = useDeleteDelivery()

  const handleEdit = (delivery: Delivery) => {
    setEditing(delivery)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditing(undefined)
  }

  const handleComplete = (id: number) => {
    if (confirm('¿Confirmar entrega? Esto descontará el stock automáticamente.')) {
      completeDelivery.mutate(id)
    }
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar esta entrega?')) {
      deleteDelivery.mutate(id)
    }
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  const statusLabels: Record<string, string> = {
    pending: 'Pendiente',
    completed: 'Completada',
    cancelled: 'Cancelada',
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
      <Navbar title="Entregas" />
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {['', 'pending', 'completed', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                  ${statusFilter === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-400'
                  }`}
              >
                {s === '' ? 'Todas' : statusLabels[s]}
              </button>
            ))}
          </div>
          <PrimaryButton label="+ Nueva entrega" onClick={() => setShowModal(true)} />
        </div>

        <div className="space-y-3">
          {deliveries?.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
              No hay entregas registradas
            </div>
          ) : (
            deliveries?.map((delivery) => (
              <div
                key={delivery.id}
                className={`bg-white rounded-xl border p-4 ${
                  delivery.status === 'pending' ? 'border-yellow-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-800">{delivery.destination_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[delivery.status]}`}>
                        {statusLabels[delivery.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      📅 {new Date(delivery.delivery_date).toLocaleDateString('es-AR', {
                        weekday: 'long', day: '2-digit', month: 'long'
                      })}
                      {delivery.delivery_time && ` — ${delivery.delivery_time}`}
                    </p>
                    {delivery.products.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {delivery.products.map((p) => (
                          <span key={p.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {p.product_name}: {p.actual_quantity ?? p.planned_quantity} {p.product_unit}
                          </span>
                        ))}
                      </div>
                    )}
                    {delivery.notes && (
                      <p className="text-xs text-gray-400 mt-1">{delivery.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-1 ml-4">
                    {delivery.status === 'pending' && (
                      <button
                        onClick={() => handleComplete(delivery.id)}
                        className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
                        ✓ Confirmar entrega
                      </button>
                    )}
                    <IconButton
                      icon={<span className="text-sm">✏️</span>}
                      onClick={() => handleEdit(delivery)}
                      tooltip="Editar"
                    />
                    <IconButton
                      icon={<span className="text-sm">🗑️</span>}
                      onClick={() => handleDelete(delivery.id)}
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
        <DeliveryModal delivery={editing} onClose={handleClose} />
      )}
    </div>
  )
}