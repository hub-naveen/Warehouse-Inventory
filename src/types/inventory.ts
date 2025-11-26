export interface InventoryItem {
  id: string;
  product_id: string;
  store_id: string;
  date: string;
  inventory_level: number;
  units_sold: number;
  units_ordered: number;
  demand_forecast: number;
  predicted_units_sold: number;
  price: number;
  discount: number;
  competitor_pricing: number;
  revenue: number;
  stock_movement: number;
  inventory_turnover: number;
  category: string;
  region: string;
  weather_condition: string;
  seasonality: string;
  holiday_promotion: boolean;
  reorder_alert: boolean;
}

export interface DashboardMetrics {
  total_revenue: number;
  total_units_sold: number;
  avg_inventory_level: number;
  inventory_turnover_rate: number;
  reorder_alerts_count: number;
  revenue_change: number;
  units_sold_change: number;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  full_name: string;
  avatar_url?: string;
}
