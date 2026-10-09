import { useDashboard } from '../hooks/useDashboard'
import { Navbar } from '../components/layout/Navbar'
import { useNavigate } from 'react-router-dom'
import { formatQuantity } from '../utils/format'

function StatCard({ label, value, icon, color }: {
  label: string
  value: number | string
  icon: string
  color: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { data, isLoading } = useDashboard()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <Navbar title="Dashboard" />
      <main className="flex-1 p-6 space-y-6">

        {data && data.stock_alerts.total_alerts > 0 && (
          <div
            className="bg-red-50 border border-red-200 rounded-xl p-4 cursor-pointer hover:bg-red-100 transition-colors"
            onClick={() => navigate('/stock')}
          >
            <p className="text-sm font-semibold text-red-700 mb-2">
              ⚠ {data.stock_alerts.total_alerts} alerta{data.stock_alerts.total_alerts > 1 ? 's' : ''} de stock bajo
            </p>
            <div className="flex flex-wrap gap-2">
              {[...data.stock_alerts.low_stock_products, ...data.stock_alerts.low_stock_raw_materials].map((item) => (
                <span key={`${item.id}-${item.name}`} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  {item.name} — {formatQuantity(item.stock_quantity, item.unit)}
                </span>
              ))}
            </div>
            <p className="text-xs text-red-400 mt-2">Ir a Stock →</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Entregas hoy"
            value={data?.deliveries.total_today ?? 0}
            icon="🚚"
            color="bg-blue-50"
          />
          <StatCard
            label="Pendientes hoy"
            value={data?.deliveries.pending ?? 0}
            icon="⏳"
            color="bg-orange-50"
          />
          <StatCard
            label="Completadas hoy"
            value={data?.deliveries.completed ?? 0}
            icon="✅"
            color="bg-green-50"
          />
          <StatCard
            label="Próximos 7 días"
            value={data?.upcoming_scheduled_orders ?? 0}
            icon="📅"
            color="bg-purple-50"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Stock bajo — Productos</h3>
            {data?.stock_alerts.low_stock_products.length === 0 ? (
              <p className="text-sm text-gray-400">Todo el stock está bien ✅</p>
            ) : (
              <div className="space-y-2">
                {data?.stock_alerts.low_stock_products.map((item) => (
                  <div key={item.id} className="flex justify-between bg-red-50 px-3 py-2 rounded-lg text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-red-600 font-medium">
                      {formatQuantity(item.stock_quantity, item.unit)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Stock bajo — Materias Primas</h3>
            {data?.stock_alerts.low_stock_raw_materials.length === 0 ? (
              <p className="text-sm text-gray-400">Todo el stock está bien ✅</p>
            ) : (
              <div className="space-y-2">
                {data?.stock_alerts.low_stock_raw_materials.map((item) => (
                  <div key={item.id} className="flex justify-between bg-red-50 px-3 py-2 rounded-lg text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-red-600 font-medium">
                      {formatQuantity(item.stock_quantity, item.unit)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}