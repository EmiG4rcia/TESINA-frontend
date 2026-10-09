export type UnitType = 'kg' | 'g' | 'l' | 'ml' | 'unidad'

export interface RawMaterial {
  id: number
  name: string
  unit: UnitType
  stock_quantity: number
  stock_min_alert: number
  alert_enabled: boolean
  is_active: boolean
  is_low_stock: boolean
  created_at: string
}

export interface RawMaterialCreate {
  name: string
  unit: UnitType
  stock_quantity?: number
  stock_min_alert?: number
  alert_enabled?: boolean
}

export interface RawMaterialUpdate {
  name?: string
  unit?: UnitType
  stock_quantity?: number
  stock_min_alert?: number
  alert_enabled?: boolean
  is_active?: boolean
}