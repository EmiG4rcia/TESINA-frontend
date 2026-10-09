import { useState } from 'react'
import { PrimaryButton, SecondaryButton, IconButton } from '../buttons'
import { useCreateProductionLog } from '../../hooks/useProduction'
import { useProducts } from '../../hooks/useProducts'
import { useRawMaterials } from '../../hooks/useRawMaterials'
import type { ProductionInputCreate } from '../../types'

interface Props {
  onClose: () => void
}

interface InputRow extends ProductionInputCreate {
  raw_material_name: string
}

export function ProductionModal({ onClose }: Props) {
  const [productId, setProductId] = useState('')
  const [producedQty, setProducedQty] = useState('')
  const [notes, setNotes] = useState('')
  const [inputs, setInputs] = useState<InputRow[]>([])
  const [selectedRmId, setSelectedRmId] = useState('')
  const [rmQty, setRmQty] = useState('')
  const [error, setError] = useState('')

  const { data: products } = useProducts()
  const { data: rawMaterials } = useRawMaterials()
  const createLog = useCreateProductionLog()

  const handleAddInput = () => {
    if (!selectedRmId || !rmQty) return
    const rm = rawMaterials?.find((r) => r.id === parseInt(selectedRmId))
    if (!rm) return

    const existing = inputs.findIndex((i) => i.raw_material_id === rm.id)
    if (existing >= 0) {
      setError('Esta materia prima ya fue agregada')
      return
    }

    setInputs([...inputs, {
      raw_material_id: rm.id,
      quantity_used: parseFloat(rmQty),
      raw_material_name: rm.name,
    }])
    setSelectedRmId('')
    setRmQty('')
    setError('')
  }

  const handleRemoveInput = (rmId: number) => {
    setInputs(inputs.filter((i) => i.raw_material_id !== rmId))
  }

  const handleSubmit = () => {
    if (!productId) { setError('Seleccioná un producto'); return }
    if (!producedQty || parseFloat(producedQty) <= 0) { setError('Ingresá la cantidad producida'); return }
    setError('')

    createLog.mutate(
      {
        product_id: parseInt(productId),
        produced_quantity: parseFloat(producedQty),
        notes: notes || undefined,
        inputs: inputs.map((inp) => ({
            raw_material_id: inp.raw_material_id,
            quantity_used: inp.quantity_used,
        })),
      },
      { onSuccess: onClose, onError: () => setError('Error al registrar la producción') }
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Registrar producción</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Producto fabricado *</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar producto</option>
              {products?.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Cantidad producida *</label>
            <input
              type="number"
              value={producedQty}
              onChange={(e) => setProducedQty(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0"
              min="0"
              step="0.001"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Notas (opcional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Observaciones del lote"
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Materias primas utilizadas
            </p>

            {inputs.length > 0 && (
              <div className="space-y-1 mb-3">
                {inputs.map((inp) => (
                  <div key={inp.raw_material_id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                    <span className="text-gray-700">{inp.raw_material_name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-xs">{inp.quantity_used}</span>
                      <IconButton
                        icon={<span className="text-xs">✕</span>}
                        onClick={() => handleRemoveInput(inp.raw_material_id)}
                        tooltip="Quitar"
                        variant="danger"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <select
                value={selectedRmId}
                onChange={(e) => setSelectedRmId(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Materia prima</option>
                {rawMaterials?.map((rm) => (
                  <option key={rm.id} value={rm.id}>{rm.name} ({rm.unit})</option>
                ))}
              </select>
              <input
                type="number"
                value={rmQty}
                onChange={(e) => setRmQty(e.target.value)}
                placeholder="Cant."
                className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                step="0.001"
              />
              <PrimaryButton label="+" onClick={handleAddInput} size="sm" />
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label="Registrar"
            onClick={handleSubmit}
            isLoading={createLog.isPending}
          />
        </div>
      </div>
    </div>
  )
}