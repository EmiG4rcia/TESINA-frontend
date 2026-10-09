export interface StockAlert {
  id: number
  name: string
  unit: string
  stock_quantity: number
  stock_min_alert: number
}

export interface DashboardData {
  date: string
  deliveries: {
    total_today: number
    pending: number
    completed: number
  }
  stock_alerts: {
    low_stock_products: StockAlert[]
    low_stock_raw_materials: StockAlert[]
    total_alerts: number
  }
  upcoming_scheduled_orders: number
}