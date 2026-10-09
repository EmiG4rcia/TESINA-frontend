type BadgeVariant =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'
  | 'payment_received'
  | 'completed'
  | 'failed'
  | 'available'
  | 'occupied'

interface BadgeProps {
  status: BadgeVariant
}

const badgeConfig: Record<BadgeVariant, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-gray-100 text-gray-700' },
  confirmed: { label: 'Confirmado', className: 'bg-blue-100 text-blue-700' },
  preparing: { label: 'Preparando', className: 'bg-orange-100 text-orange-700' },
  ready: { label: 'Listo', className: 'bg-green-100 text-green-700' },
  delivered: { label: 'Entregado', className: 'bg-green-200 text-green-800' },
  cancelled: { label: 'Cancelado', className: 'bg-red-100 text-red-700' },
  payment_received: { label: 'Pago recibido', className: 'bg-yellow-100 text-yellow-700' },
  completed: { label: 'Completado', className: 'bg-green-100 text-green-700' },
  failed: { label: 'Fallido', className: 'bg-red-100 text-red-700' },
  available: { label: 'Disponible', className: 'bg-green-100 text-green-700' },
  occupied: { label: 'Ocupada', className: 'bg-orange-100 text-orange-700' },
}

export function Badge({ status }: BadgeProps) {
  const config = badgeConfig[status]
  return (
    <span className={`${config.className} px-2.5 py-0.5 rounded-full text-xs font-medium`}>
      {config.label}
    </span>
  )
}