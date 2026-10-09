export function formatQuantity(value: number | string, unit: string): string {
  const displayUnit = unit === 'unidad' ? 'ud' : unit
  const num = parseFloat(String(value))

  if (isNaN(num)) return `0 ${displayUnit}`

  if (unit === 'unidad') {
    return `${Math.round(num)} ${displayUnit}`
  }

  // Remove trailing zeros by parsing again
  const clean = parseFloat(num.toFixed(3))

  const formatted = clean.toLocaleString('es-AR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  })

  return `${formatted} ${displayUnit}`
}

export function formatUnit(unit: string): string {
  return unit === 'unidad' ? 'ud' : unit
}