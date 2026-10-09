import { useState } from 'react'
import type { User, UserCreate, UserUpdate, UserRole } from '../../types'
import { PrimaryButton, SecondaryButton } from '../buttons'
import { useCreateUser, useUpdateUser } from '../../hooks/useUsers'

interface Props {
  user?: User
  onClose: () => void
}

export function UserModal({ user, onClose }: Props) {
  const isEditing = !!user
  const [form, setForm] = useState({
    username: user?.username ?? '',
    password: '',
    role: user?.role ?? 'employee' as UserRole,
  })
  const [error, setError] = useState('')

  const create = useCreateUser()
  const update = useUpdateUser()
  const isPending = create.isPending || update.isPending

  const handleSubmit = () => {
    if (!form.username.trim()) { setError('El nombre de usuario es obligatorio'); return }
    if (!isEditing && !form.password) { setError('La contraseña es obligatoria'); return }
    setError('')

    if (isEditing) {
      const data: UserUpdate = { username: form.username, role: form.role }
      update.mutate({ id: user.id, data }, { onSuccess: onClose, onError: () => setError('Error al actualizar') })
    } else {
      const data: UserCreate = { username: form.username, password: form.password, role: form.role }
      create.mutate(data, { onSuccess: onClose, onError: () => setError('Ya existe un usuario con ese nombre') })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {isEditing ? 'Editar usuario' : 'Nuevo usuario'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Usuario *</label>
            <input
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nombre de usuario"
              autoFocus
            />
          </div>

          {!isEditing && (
            <div>
              <label className="block text-sm text-gray-600 mb-1">Contraseña *</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contraseña"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-600 mb-1">Rol</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="owner">Dueño</option>
              <option value="employee">Empleado</option>
            </select>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
          <SecondaryButton label="Cancelar" onClick={onClose} />
          <PrimaryButton
            label={isEditing ? 'Guardar cambios' : 'Crear usuario'}
            onClick={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  )
}