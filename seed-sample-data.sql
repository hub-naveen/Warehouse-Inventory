-- Sample Inventory Data for Warehouse Dashboard
-- This script inserts sample data that demonstrates ML model predictions

-- Note: Run this after signing up for your first account
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users

-- Insert sample inventory data (30 days of data)
INSERT INTO inventory_data (product_id, store_id, date, inventory_level, units_sold, units_ordered, demand_forecast, predicted_units_sold, price, discount, competitor_pricing, revenue, stock_movement, inventory_turnover, category, region, weather_condition, seasonality, holiday_promotion, reorder_alert)
SELECT
  'P' || LPAD((floor(random() * 5) + 1)::text, 3, '0') as product_id,
  'S' || LPAD((floor(random() * 3) + 1)::text, 3, '0') as store_id,
  (CURRENT_DATE - (generate_series * interval '1 day'))::date as date,
  floor(random() * 500 + 100)::numeric as inventory_level,
  (floor(random() * 100 + 50) + (random() - 0.5) * 20)::numeric as units_sold,
  floor((random() * 100 + 50) * 1.2)::numeric as units_ordered,
  (floor(random() * 100 + 50) * 1.05)::numeric as demand_forecast,
  (floor(random() * 100 + 50) + (random() - 0.5) * 10)::numeric as predicted_units_sold,
  (random() * 50 + 10)::numeric as price,
  CASE WHEN random() > 0.7 THEN random() * 0.3 ELSE 0 END::numeric as discount,
  ((random() * 50 + 10) * (random() * 0.2 + 0.9))::numeric as competitor_pricing,
  ((random() * 100 + 50) * (random() * 50 + 10))::numeric as revenue,
  (floor((random() * 100 + 50) * 1.2) - floor(random() * 100 + 50))::numeric as stock_movement,
  CASE WHEN floor(random() * 500 + 100) > 0
    THEN (floor(random() * 100 + 50) / floor(random() * 500 + 100)::float)::numeric
    ELSE 0
  END as inventory_turnover,
  (ARRAY['Electronics', 'Clothing', 'Food', 'Home'])[floor(random() * 4 + 1)] as category,
  (ARRAY['North', 'South', 'East', 'West'])[floor(random() * 4 + 1)] as region,
  (ARRAY['Sunny', 'Rainy', 'Cloudy', 'Snowy'])[floor(random() * 4 + 1)] as weather_condition,
  (ARRAY['Spring', 'Summer', 'Fall', 'Winter'])[floor(EXTRACT(MONTH FROM CURRENT_DATE)::int / 3) + 1] as seasonality,
  random() > 0.8 as holiday_promotion,
  floor(random() * 500 + 100) < 200 as reorder_alert
FROM generate_series(0, 30) as generate_series
CROSS JOIN generate_series(1, 15)
ON CONFLICT (product_id, store_id, date) DO NOTHING;

-- Sample notifications
-- Replace 'YOUR_USER_ID' with actual user ID after signup
/*
INSERT INTO notifications (user_id, type, title, message, read, created_at)
VALUES
  ('YOUR_USER_ID', 'reorder', 'Low Inventory Alert', 'Product P001 at Store S001 has reached reorder threshold. Current level: 150 units.', false, NOW() - interval '1 hour'),
  ('YOUR_USER_ID', 'anomaly', 'Sales Anomaly Detected', 'Unusual sales pattern detected for Product P002. Actual sales exceeded forecast by 25.3%.', false, NOW() - interval '3 hours'),
  ('YOUR_USER_ID', 'forecast', 'Demand Forecast Update', 'Updated forecast shows increased demand for Electronics category next week.', true, NOW() - interval '1 day'),
  ('YOUR_USER_ID', 'system', 'System Update', 'ML model has been retrained with latest data. Prediction accuracy improved by 2.3%.', true, NOW() - interval '2 days'),
  ('YOUR_USER_ID', 'reorder', 'Multiple Reorder Alerts', '5 products across 3 stores require immediate restocking.', false, NOW() - interval '30 minutes');
*/

-- Verify data insertion
SELECT
  COUNT(*) as total_records,
  COUNT(DISTINCT product_id) as unique_products,
  COUNT(DISTINCT store_id) as unique_stores,
  MIN(date) as earliest_date,
  MAX(date) as latest_date
FROM inventory_data;
