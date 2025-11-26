/*
  # Generate 100,000 Inventory Records
  
  Creates ~100,000 realistic inventory data records spanning 2 years.
  Data includes:
  - 50 products (P0001-P0050)
  - 40 stores (S001-S040)  
  - 5 categories: Groceries, Toys, Electronics, Furniture, Clothing
  - 4 regions: North, South, East, West
  - Realistic metrics: pricing, demand, inventory, ML predictions
  - Weather conditions and seasonal data
  - Holiday promotions and reorder alerts
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
)
SELECT
  (ARRAY['P0001','P0002','P0003','P0004','P0005','P0006','P0007','P0008','P0009','P0010',
          'P0011','P0012','P0013','P0014','P0015','P0016','P0017','P0018','P0019','P0020',
          'P0021','P0022','P0023','P0024','P0025','P0026','P0027','P0028','P0029','P0030',
          'P0031','P0032','P0033','P0034','P0035','P0036','P0037','P0038','P0039','P0040',
          'P0041','P0042','P0043','P0044','P0045','P0046','P0047','P0048','P0049','P0050'])[floor(random() * 50)::int + 1] as product_id,
  (ARRAY['S001','S002','S003','S004','S005','S006','S007','S008','S009','S010',
          'S011','S012','S013','S014','S015','S016','S017','S018','S019','S020',
          'S021','S022','S023','S024','S025','S026','S027','S028','S029','S030',
          'S031','S032','S033','S034','S035','S036','S037','S038','S039','S040'])[floor(random() * 40)::int + 1] as store_id,
  current_date - (floor(random() * 730))::int * interval '1 day' as date,
  (floor(random() * 750) + 50)::numeric as inventory_level,
  (floor(random() * 170) + 30)::numeric as units_sold,
  (floor(random() * 136) + 24)::numeric as units_ordered,
  (floor(random() * 184) + 32)::numeric as demand_forecast,
  (floor(random() * 170) + 30)::numeric as predicted_units_sold,
  round((random() * 145 + 5)::numeric, 2) as price,
  case when random() > 0.75 then round((random() * 0.30)::numeric, 2) else 0 end as discount,
  round((random() * 130 + 5 * 0.95)::numeric, 2) as competitor_pricing,
  round(((floor(random() * 170) + 30) * (random() * 145 + 5) * 0.88)::numeric, 2) as revenue,
  (floor(random() * 136) + 24 - floor(random() * 170) - 30)::numeric as stock_movement,
  round(((floor(random() * 170) + 30)::numeric / (floor(random() * 750) + 50)::numeric), 4) as inventory_turnover,
  (ARRAY['Groceries','Toys','Electronics','Furniture','Clothing'])[floor(random() * 5)::int + 1] as category,
  (ARRAY['North','South','East','West'])[floor(random() * 4)::int + 1] as region,
  (ARRAY['Sunny','Rainy','Cloudy','Snowy'])[floor(random() * 4)::int + 1] as weather_condition,
  (ARRAY['Spring','Summer','Autumn','Winter'])[floor(random() * 4)::int + 1] as seasonality,
  random() > 0.85 as holiday_promotion,
  (floor(random() * 750) + 50) < 150 as reorder_alert
FROM generate_series(1, 100000) as gen(id)
ON CONFLICT (product_id, store_id, date) DO NOTHING;
