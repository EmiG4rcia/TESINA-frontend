import { useState } from 'react'
import { useStockMovements } from '../hooks/useStock'
import { useProducts } from '../hooks/useProducts'
import { useRawMaterials } from '../hooks/useRawMaterials'
import { Navbar } from '../components/layout/Navbar'
import { StockModal } from '../components/modals/StockModal'
import { formatQuantity } from '../utils/format'
import type { Product, RawMaterial } from '../types'

type StockModalConfig = {
  itemType: 'product' | 'raw_material'
  item: Product | RawMaterial
  mode: 'purchase' | 'adjustment'
}

export function StockPage() {
  const [modalConfig, setModalConfig] = useState<StockModalConfig | null>(null)
  const [filterType, setFilterType] = useState<'product' | 'raw_material' | undefined>()
  const [filterItemId, setFilterItemId] = useState<number | undefined>()

  const { data: products } = useProducts(true)
  const { data: rawMaterials } = useRawMaterials(true)
  const { data: movements, isLoading } = useStockMovements(filterType, filterItemId)

  const openModal = (
    itemType: 'product' | 'raw_material',
    item: Product | RawMaterial,
    mode: 'purchase' | 'adjustment'
  ) => setModalConfig({ itemType, item, mode })

  const movementLabels: Record<string, { label: string; color: string }> = {
    purchase: { label: 'Compra', color: 'bg-green-100 text-green-700' },
    production_in: { label: 'Producción +', color: 'bg-blue-100 text-blue-700' },
    production_out: { label: 'Producción −', color: 'bg-orange-100 text-orange-700' },
    delivery: { label: 'Entrega', color: 'bg-purple-100 text-purple-700' },
    adjustment: { label: 'Ajuste', color: 'bg-gray-100 text-gray-700' },
    waste: { label: 'Merma', color: 'bg-red-100 text-red-700' },
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Stock" />
      <main className="flex-1 p-6 space-y-6">

        {/* Products stock */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Productos Finales</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Mínimo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products?.map((product) => (
                <tr key={product.id} className={`hover:bg-gray-50 ${product.is_low_stock ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{product.name}</span>
                      {product.is_low_stock && (
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">⚠ Bajo</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.is_low_stock ? 'text-red-600' : 'text-gray-800'}`}>
                      {formatQuantity(product.stock_quantity, product.unit)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatQuantity(product.stock_min_alert, product.unit)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('product', product, 'purchase')}
                        className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        + Compra
                      </button>
                      <button
                        onClick={() => openModal('product', product, 'adjustment')}
                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        Ajuste
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('product')
                          setFilterItemId(filterItemId === product.id ? undefined : product.id)
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium
                          ${filterItemId === product.id && filterType === 'product'
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        Historial
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Raw materials stock */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Materias Primas</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nombre</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Mínimo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rawMaterials?.map((rm) => (
                <tr key={rm.id} className={`hover:bg-gray-50 ${rm.is_low_stock ? 'bg-red-50' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{rm.name}</span>
                      {rm.is_low_stock && (
                        <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">⚠ Bajo</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${rm.is_low_stock ? 'text-red-600' : 'text-gray-800'}`}>
                      {formatQuantity(rm.stock_quantity, rm.unit)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatQuantity(rm.stock_min_alert, rm.unit)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal('raw_material', rm, 'purchase')}
                        className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        + Compra
                      </button>
                      <button
                        onClick={() => openModal('raw_material', rm, 'adjustment')}
                        className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-medium"
                      >
                        Ajuste
                      </button>
                      <button
                        onClick={() => {
                          setFilterType('raw_material')
                          setFilterItemId(filterItemId === rm.id ? undefined : rm.id)
                        }}
                        className={`text-xs px-3 py-1.5 rounded-lg transition-colors font-medium
                          ${filterItemId === rm.id && filterType === 'raw_material'
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                      >
                        Historial
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Movements history */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">
              Movimientos {filterItemId ? '— filtrado' : ''}
            </h3>
            {filterItemId && (
              <button
                onClick={() => { setFilterType(undefined); setFilterItemId(undefined) }}
                className="text-xs text-gray-400 hover:text-gray-600"
              >
                Ver todos ×
              </button>
            )}
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-24">
              <span className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Tipo</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Movimiento</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Cantidad</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Usuario</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Notas</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {movements?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No hay movimientos registrados
                    </td>
                  </tr>
                ) : (
                  movements?.map((m) => {
                    const badge = movementLabels[m.movement_type] ?? { label: m.movement_type, color: 'bg-gray-100 text-gray-700' }
                    return (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">{m.item_name}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {m.item_type === 'product' ? 'Producto' : 'Materia Prima'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className={`px-4 py-3 font-medium ${Number(m.quantity) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Number(m.quantity) > 0 ? '+' : ''}{m.quantity}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{m.created_by_username ?? '-'}</td>
                        <td className="px-4 py-3 text-gray-500">{m.notes ?? '-'}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(m.created_at).toLocaleDateString('es-AR', {
                            day: '2-digit', month: '2-digit', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {modalConfig && (
        <StockModal
          itemType={modalConfig.itemType}
          item={modalConfig.item}
          mode={modalConfig.mode}
          onClose={() => setModalConfig(null)}
        />
      )}
    </div>
  )
}