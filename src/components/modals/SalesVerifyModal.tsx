import { useState } from 'react'
import { useSalesVerify } from '../../hooks/useAuth'
import { PrimaryButton, SecondaryButton } from '../buttons'

interface SalesVerifyModalProps {
  onSuccess: () => void
  onClose: () => void
}

export function SalesVerifyModal({ onSuccess, onClose }: SalesVerifyModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const salesVerify = useSalesVerify()

  const handleSubmit = () => {
    if (!password.trim()) return
    setError('')
    salesVerify.mutate(password, {
      onSuccess: () => onSuccess(),
      onError: () => setError('Contraseña incorrecta. Intentá de nuevo.'),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            Acceso a Ventas
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500">
            Ingresá tu contraseña de ventas para continuar.
          </p>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Contraseña de ventas
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label="Verificar"
            onClick={handleSubmit}
            isLoading={salesVerify.isPending}
          />
        </div>
      </div>
    </div>
  )
}