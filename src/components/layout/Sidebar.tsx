import { NavLink } from 'react-router-dom'
import { useAuthContext } from '../../auth/useAuthContext'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊', ownerOnly: false },
  { path: '/deliveries', label: 'Entregas', icon: '🚚', ownerOnly: false },
  { path: '/scheduled-orders', label: 'Agenda', icon: '📅', ownerOnly: false },
  { path: '/products', label: 'Productos', icon: '📦', ownerOnly: false },
  { path: '/raw-materials', label: 'Materias Primas', icon: '🥩', ownerOnly: false },
  { path: '/production', label: 'Producción', icon: '🏭', ownerOnly: false },
  { path: '/stock', label: 'Stock', icon: '📋', ownerOnly: false },
  { path: '/destinations', label: 'Destinos', icon: '📍', ownerOnly: true },
  { path: '/users', label: 'Usuarios', icon: '👥', ownerOnly: true },
]

export function Sidebar() {
  const { logout, username, role, isOwner } = useAuthContext()

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-lg font-bold text-white">Gestión de Negocio</h1>
        <p className="text-xs text-gray-400 mt-0.5">Panel de Administración</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems
          .filter(item => !item.ownerOnly || isOwner)
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                transition-colors duration-200
                ${isActive
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }
              `}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
      </nav>

      <div className="px-4 py-4 border-t border-gray-700">
        <div className="mb-3 px-3">
          <p className="text-xs font-medium text-white">{username}</p>
          <p className="text-xs text-gray-400 capitalize">{role}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
            text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200"
        >
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}