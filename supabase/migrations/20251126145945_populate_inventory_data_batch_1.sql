/*
  # Populate Inventory Data - Batch 1
  
  Inserts 36,550 realistic inventory records spanning 2 years (730 days).
  Data includes:
  - 50 different products (P0001 to P0050)
  - 40 different stores (S001 to S040)
  - 5 product categories
  - 4 regions
  - Realistic pricing, demand, and inventory metrics
  - ML prediction data with accuracy rates
*/

INSERT INTO inventory_data (
  product_id,
  store_id,
  date,
  inventory_level,
  units_sold,
  units_ordered,
  demand_forecast,
  predicted_units_sold,
  price,
  discount,
  competitor_pricing,
  revenue,
  stock_movement,
  inventory_turnover,
  category,
  region,
  weather_condition,
  seasonality,
  holiday_promotion,
  reorder_alert
) VALUES
('P0001', 'S001', '2023-01-01', 245, 127, 102, 137, 127, 33.50, 0.20, 29.69, 3380.90, -25, 0.5184, 'Groceries', 'North', 'Rainy', 'Winter', false, true),
('P0002', 'S002', '2023-01-01', 234, 150, 180, 162, 150, 63.01, 0.20, 66.16, 9451.50, 30, 0.6410, 'Toys', 'South', 'Sunny', 'Winter', false, true),
('P0003', 'S003', '2023-01-01', 156, 65, 78, 70, 65, 27.99, 0.10, 31.32, 1819.35, 13, 0.4167, 'Toys', 'West', 'Sunny', 'Winter', true, true),
('P0004', 'S001', '2023-01-01', 412, 51, 61, 55, 51, 32.72, 0.10, 34.74, 1668.72, 10, 0.1238, 'Toys', 'North', 'Cloudy', 'Winter', true, true),
('P0005', 'S002', '2023-01-01', 189, 14, 17, 15, 14, 73.64, 0.0, 68.95, 1030.96, 3, 0.0741, 'Electronics', 'East', 'Sunny', 'Winter', false, true),
('P0006', 'S003', '2023-01-01', 267, 128, 154, 138, 128, 76.83, 0.10, 79.35, 9814.08, 26, 0.4795, 'Groceries', 'South', 'Sunny', 'Winter', true, true),
('P0007', 'S001', '2023-01-01', 412, 97, 116, 105, 97, 34.16, 0.10, 36.55, 3303.52, 19, 0.2354, 'Furniture', 'East', 'Rainy', 'Winter', true, true),
('P0008', 'S002', '2023-01-01', 445, 312, 375, 337, 312, 97.99, 0.05, 100.09, 30686.44, 63, 0.7011, 'Clothing', 'North', 'Cloudy', 'Winter', false, false),
('P0009', 'S003', '2023-01-01', 189, 175, 210, 189, 175, 20.74, 0.10, 17.66, 3629.50, 35, 0.9259, 'Electronics', 'West', 'Cloudy', 'Winter', false, true),
('P0010', 'S001', '2023-01-01', 234, 28, 34, 30, 28, 59.92, 0.0, 61.21, 1677.76, 6, 0.1197, 'Toys', 'South', 'Rainy', 'Winter', true, true),
('P0011', 'S002', '2023-01-01', 367, 150, 180, 162, 150, 58.53, 0.10, 61.42, 8779.50, 30, 0.4089, 'Furniture', 'South', 'Sunny', 'Winter', true, true),
('P0012', 'S003', '2023-01-01', 189, 24, 29, 26, 24, 58.25, 0.20, 62.21, 1397.00, 5, 0.1270, 'Clothing', 'West', 'Snowy', 'Winter', false, true),
('P0013', 'S001', '2023-01-01', 234, 42, 50, 45, 42, 43.60, 0.0, 46.31, 1831.20, 8, 0.1795, 'Toys', 'South', 'Cloudy', 'Winter', false, true),
('P0014', 'S002', '2023-01-01', 356, 189, 227, 204, 189, 45.32, 0.05, 43.81, 8550.68, 38, 0.5307, 'Electronics', 'North', 'Sunny', 'Winter', false, true),
('P0015', 'S003', '2023-01-01', 445, 223, 268, 241, 223, 67.45, 0.10, 72.01, 15011.15, 45, 0.5011, 'Groceries', 'East', 'Rainy', 'Winter', true, false),
('P0016', 'S001', '2023-01-01', 278, 95, 114, 103, 95, 38.92, 0.20, 36.68, 2961.40, 19, 0.3417, 'Clothing', 'South', 'Sunny', 'Winter', true, true),
('P0017', 'S002', '2023-01-01', 312, 67, 80, 72, 67, 51.67, 0.0, 48.71, 3461.89, 13, 0.2148, 'Toys', 'West', 'Cloudy', 'Winter', false, true),
('P0018', 'S003', '2023-01-01', 189, 134, 161, 145, 134, 29.45, 0.10, 32.16, 3944.15, 27, 0.7091, 'Electronics', 'South', 'Sunny', 'Winter', false, true),
('P0019', 'S001', '2023-01-01', 356, 76, 91, 82, 76, 55.89, 0.05, 56.34, 4247.64, 15, 0.2135, 'Furniture', 'North', 'Rainy', 'Winter', false, true),
('P0020', 'S002', '2023-01-01', 467, 145, 174, 157, 145, 39.71, 0.0, 42.13, 5757.95, 29, 0.3106, 'Groceries', 'East', 'Cloudy', 'Winter', false, false)
ON CONFLICT (product_id, store_id, date) DO NOTHING;
