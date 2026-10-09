export type IngredientUnit = 'kg' | 'g' | 'l' | 'ml' | 'unidad'

export interface Ingredient {
  id: number
  name: string
  unit: IngredientUnit
  stock_quantity: number | string
  stock_min_alert: number | string
  cost_per_unit: number | string
  is_allergen: boolean
  is_active: boolean
  is_low_stock: boolean
  created_at: string
}

export interface IngredientCreate {
  name: string
  unit: IngredientUnit
  stock_quantity?: number
  stock_min_alert?: number
  cost_per_unit?: number
  is_allergen?: boolean
}

export interface IngredientUpdate {
  name?: string
  unit?: IngredientUnit
  stock_quantity?: number
  stock_min_alert?: number
  cost_per_unit?: number
  is_allergen?: boolean
  is_active?: boolean
}

export interface MenuItemIngredientCreate {
  ingredient_id: number
  quantity_used: number
}

export interface MenuItemIngredientResponse {
  id: number
  ingredient_id: number
  quantity_used: number
  ingredient_name: string | null
  ingredient_unit: string | null
}