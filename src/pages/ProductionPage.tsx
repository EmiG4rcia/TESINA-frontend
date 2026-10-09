import { useState } from 'react'
import { useProductionLogs, useDeleteProductionLog } from '../hooks/useProduction'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, IconButton } from '../components/buttons'
import { ProductionModal } from '../components/modals/ProductionModal'

export function ProductionPage() {
  const [showModal, setShowModal] = useState(false)
  const { data: logs, isLoading } = useProductionLogs()
  const deleteLog = useDeleteProductionLog()

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este registro de producción?')) {
      deleteLog.mutate(id)
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
      <Navbar title="Producción" />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <PrimaryButton label="+ Registrar producción" onClick={() => setShowModal(true)} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cantidad producida</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Estimado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Rendimiento</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No hay registros de producción
                  </td>
                </tr>
              ) : (
                logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-800">{log.product_name}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {log.produced_quantity} {log.product_unit}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {log.estimated_quantity ? `${log.estimated_quantity} ${log.product_unit}` : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {log.yield_percentage != null ? (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          log.yield_percentage >= 95
                            ? 'bg-green-100 text-green-700'
                            : log.yield_percentage >= 80
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {log.yield_percentage}%
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{log.created_by_username ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(log.created_at).toLocaleDateString('es-AR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <IconButton
                        icon={<span className="text-sm">🗑️</span>}
                        onClick={() => handleDelete(log.id)}
                        tooltip="Eliminar"
                        variant="danger"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <ProductionModal onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}