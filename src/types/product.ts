import type { UnitType } from './rawMaterial'

export interface RecipeItem {
  id: number
  raw_material_id: number
  raw_material_name: string | null
  estimated_quantity: number
  unit: string
  yield_quantity: number
}

export interface RecipeItemCreate {
  raw_material_id: number
  estimated_quantity: number
  unit: string
  yield_quantity?: number
}

export interface Product {
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

export interface ProductCreate {
  name: string
  unit: UnitType
  stock_quantity?: number
  stock_min_alert?: number
  alert_enabled?: boolean
}

export interface ProductUpdate {
  name?: string
  unit?: UnitType
  stock_quantity?: number
  stock_min_alert?: number
  alert_enabled?: boolean
  is_active?: boolean
}