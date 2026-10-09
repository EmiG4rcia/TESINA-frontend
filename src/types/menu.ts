export interface CategoryBasic {
  id: number
  name: string
}

export interface MenuItem {
  id: number
  category_id: number | null
  category: CategoryBasic | null
  name: string | null
  description: string | null
  price: number | null
  is_available: boolean
  popularity_score: number
}

export interface MenuItemCreate {
  category_id?: number
  name: string
  description?: string
  price: number
  is_available: boolean
}

export interface MenuItemUpdate {
  category_id?: number
  name?: string
  description?: string
  price?: number
  is_available?: boolean
}