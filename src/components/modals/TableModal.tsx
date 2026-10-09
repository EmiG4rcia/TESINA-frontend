import { useState } from 'react'
import type { Table, TableCreate } from '../../types'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { useCreateTable } from '../../hooks/useTables'

interface TableModalProps {
  table?: Table
  onClose: () => void
}

export function TableModal({ table, onClose }: TableModalProps) {
  const isEditing = !!table
  const [tableNumber, setTableNumber] = useState(table?.table_number ?? '')
  const createTable = useCreateTable()

  const handleSubmit = () => {
    if (!tableNumber.trim()) return
    const data: TableCreate = { table_number: tableNumber.trim() }
    createTable.mutate(data, { onSuccess: onClose })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar mesa' : 'Nueva mesa'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-5">
          <label className="block text-sm text-gray-600 mb-1">Número de mesa</label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej: 4"
          />
          <p className="text-xs text-gray-400 mt-2">
            El código QR se generará automáticamente.
          </p>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={isEditing ? 'Guardar' : 'Crear mesa'}
            onClick={handleSubmit}
            isLoading={createTable.isPending}
          />
        </div>
      </div>
    </div>
  )
}