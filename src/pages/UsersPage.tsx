import { useState } from 'react'
import { useUsers, useDeleteUser, useUpdateUser } from '../hooks/useUsers'
import { Navbar } from '../components/layout/Navbar'
import { PrimaryButton, IconButton } from '../components/buttons'
import { UserModal } from '../components/modals/UserModal'
import type { User } from '../types'

export function UsersPage() {
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<User | undefined>()

  const { data: users, isLoading } = useUsers()
  const deleteUser = useDeleteUser()
  const updateUser = useUpdateUser()

  const handleEdit = (user: User) => {
    setEditing(user)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditing(undefined)
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      deleteUser.mutate(id)
    }
  }

  const handleToggleActive = (user: User) => {
    updateUser.mutate({ id: user.id, data: { is_active: !user.is_active } })
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
      <Navbar title="Usuarios" />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-6">
          <PrimaryButton label="+ Nuevo usuario" onClick={() => setShowModal(true)} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Último acceso</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{user.username}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      user.role === 'owner'
                        ? 'bg-purple-50 text-purple-600'
                        : 'bg-blue-50 text-blue-600'
                    }`}>
                      {user.role === 'owner' ? 'Dueño' : 'Empleado'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {user.last_login
                      ? new Date(user.last_login).toLocaleDateString('es-AR', {
                          day: '2-digit', month: '2-digit', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })
                      : 'Nunca'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                        user.is_active
                          ? 'bg-green-50 text-green-600 hover:bg-green-100'
                          : 'bg-red-50 text-red-500 hover:bg-red-100'
                      }`}
                    >
                      {user.is_active ? '✓ Activo' : '✗ Inactivo'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <IconButton
                        icon={<span className="text-sm">✏️</span>}
                        onClick={() => handleEdit(user)}
                        tooltip="Editar"
                      />
                      <IconButton
                        icon={<span className="text-sm">🗑️</span>}
                        onClick={() => handleDelete(user.id)}
                        tooltip="Eliminar"
                        variant="danger"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {showModal && (
        <UserModal user={editing} onClose={handleClose} />
      )}
    </div>
  )
}