import { useProductRecipe } from '../../hooks/useProducts'
import type { Product } from '../../types'
import { SecondaryButton } from '../buttons'

interface Props {
  item: Product
  onClose: () => void
  onEdit: () => void
}

export function ProductDetailModal({ item, onClose, onEdit }: Props) {
  const { data: recipe, isLoading } = useProductRecipe(item.id)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Detalle del producto</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Info general */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Unidad</p>
              <p className="text-sm font-medium text-gray-800">{item.unit}</p>
            </div>
            <div className={`rounded-lg p-3 ${item.is_low_stock ? 'bg-red-50' : 'bg-gray-50'}`}>
              <p className="text-xs text-gray-400 mb-1">Stock actual</p>
              <p className={`text-sm font-medium ${item.is_low_stock ? 'text-red-600' : 'text-gray-800'}`}>
                {parseFloat(item.stock_quantity.toString())} {item.unit}
                {item.is_low_stock && <span className="ml-1 text-xs">⚠</span>}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Mínimo de alerta</p>
              <p className="text-sm font-medium text-gray-800">
                {parseFloat(item.stock_min_alert.toString())} {item.unit}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-400 mb-1">Alerta</p>
              <p className="text-sm font-medium text-gray-800">
                {item.alert_enabled ? '✅ Activa' : '❌ Desactivada'}
              </p>
            </div>
          </div>

          {/* Estado */}
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              item.is_active
                ? 'bg-blue-50 text-blue-600'
                : 'bg-red-50 text-red-500'
            }`}>
              {item.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </div>

          {/* Receta */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">Receta estimada</p>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <span className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : recipe && recipe.length > 0 ? (
              <div className="space-y-2">
                {recipe.map((r) => (
                  <div key={r.id} className="flex items-center justify-between bg-gray-50 px-3 py-2.5 rounded-lg text-sm">
                    <span className="text-gray-700 font-medium">{r.raw_material_name}</span>
                    <span className="text-gray-500 text-xs">
                      {parseFloat(r.estimated_quantity.toString())} {r.unit} → rinde {parseFloat(r.yield_quantity.toString())} {r.yield_unit}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Sin receta configurada</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cerrar" onClick={onClose} />
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            ✏️ Editar
          </button>
        </div>
      </div>
    </div>
  )
}