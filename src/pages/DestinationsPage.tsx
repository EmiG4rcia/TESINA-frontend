import { useState } from 'react'
import { useDestinations, useDeleteDestination } from '../hooks/useDestinations'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, IconButton } from '../components/buttons'
import { DestinationModal } from '../components/modals/DestinationModal'
import type { Destination } from '../types'

export function DestinationsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Destination | undefined>()

  const { data: destinations, isLoading } = useDestinations(true)
  const deleteDestination = useDeleteDestination()

  const handleEdit = (item: Destination) => {
    setEditing(item)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditing(undefined)
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este destino?')) {
      deleteDestination.mutate(id)
    }
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
      <Navbar title="Destinos" />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <PrimaryButton label="+ Nuevo destino" onClick={() => setShowModal(true)} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Dirección</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Contacto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {destinations?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    No hay destinos registrados
                  </td>
                </tr>
              ) : (
                destinations?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.address ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{item.contact ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.is_active
                          ? 'bg-green-50 text-green-600'
                          : 'bg-red-50 text-red-500'
                      }`}>
                        {item.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <IconButton
                          icon={<span className="text-sm">✏️</span>}
                          onClick={() => handleEdit(item)}
                          tooltip="Editar"
                        />
                        <IconButton
                          icon={<span className="text-sm">🗑️</span>}
                          onClick={() => handleDelete(item.id)}
                          tooltip="Eliminar"
                          variant="danger"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <DestinationModal item={editing} onClose={handleClose} />
      )}
    </div>
  )
}