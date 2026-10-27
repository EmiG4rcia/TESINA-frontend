import { useState } from 'react'
import { useProducts, useDeleteProduct } from '../hooks/useProducts'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, IconButton } from '../components/buttons'
import { ProductModal } from '../components/modals/ProductModal'
import { formatQuantity } from '../utils/format'
import type { Product } from '../types'
import { ProductDetailModal } from '../components/modals/ProductDetailModal'  

export function ProductsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | undefined>()
  const [viewing, setViewing] = useState <Product | undefined>()
  const { data: products, isLoading } = useProducts(true)
  const deleteProduct = useDeleteProduct()

  const handleEdit = (item: Product) => {
    setEditing(item)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditing(undefined)
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      deleteProduct.mutate(id)
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
      <Navbar title="Productos" />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <PrimaryButton label="+ Nuevo producto" onClick={() => setShowModal(true)} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Unidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Stock actual</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Mínimo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Alerta</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                products?.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${item.is_low_stock ? 'bg-red-50' : ''}`}
                    onClick={() => setViewing(item)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{item.name}</span>
                        {item.is_low_stock && (
                          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                            ⚠ Bajo
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.unit}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${item.is_low_stock ? 'text-red-600' : 'text-gray-800'}`}>
                        {formatQuantity(item.stock_quantity, item.unit)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatQuantity(item.stock_min_alert, item.unit)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.alert_enabled
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {item.alert_enabled ? 'Activa' : 'Desactivada'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.is_active
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-red-50 text-red-500'
                      }`}>
                        {item.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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

      {viewing && (
        <ProductDetailModal
          item={viewing}
          onClose={() => setViewing(undefined)}
          onEdit={() => {
            setEditing(viewing)
            setViewing(undefined)
            setShowModal(true)
          }}
        />
      )}

      {showModal && (
        <ProductModal item={editing} onClose={handleClose} />
      )}
    </div>
  )
}