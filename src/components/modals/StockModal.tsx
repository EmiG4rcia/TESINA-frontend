import { useState } from 'react'
import type { Product, RawMaterial } from '../../types'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { usePurchaseStock, useAdjustStock } from '../../hooks/useStock'

interface Props {
  itemType: 'product' | 'raw_material'
  item: Product | RawMaterial
  mode: 'purchase' | 'adjustment'
  onClose: () => void
}

export function StockModal({ itemType, item, mode, onClose }: Props) {
  const [quantity, setQuantity] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const purchase = usePurchaseStock()
  const adjust = useAdjustStock()
  const isPending = purchase.isPending || adjust.isPending

  const handleSubmit = () => {
    const qty = parseFloat(quantity)
    if (!quantity || isNaN(qty)) { setError('Ingresá una cantidad válida'); return }
    if (mode === 'purchase' && qty <= 0) { setError('La cantidad debe ser mayor a 0'); return }
    setError('')

    if (mode === 'purchase') {
      purchase.mutate(
        { item_type: itemType, item_id: item.id, quantity: qty, notes: notes || undefined },
        { onSuccess: onClose, onError: () => setError('Error al registrar la compra') }
      )
    } else {
      adjust.mutate(
        { item_type: itemType, item_id: item.id, quantity: qty, notes: notes || undefined },
        { onSuccess: onClose, onError: () => setError('Error al registrar el ajuste') }
      )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              {mode === 'purchase' ? 'Registrar compra' : 'Ajuste de stock'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{item.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Cantidad ({item.unit})
              {mode === 'adjustment' && <span className="text-gray-400 ml-1">— negativo para reducir</span>}
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={mode === 'purchase' ? '0.000' : '+10 o -5'}
              step="0.001"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Notas (opcional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={mode === 'purchase' ? 'Proveedor, lote...' : 'Motivo del ajuste'}
            />
          </div>

          <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm">
            <span className="text-gray-500">Stock actual: </span>
            <span className="font-medium text-gray-800">{item.stock_quantity} {item.unit}</span>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={mode === 'purchase' ? 'Registrar compra' : 'Aplicar ajuste'}
            onClick={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}