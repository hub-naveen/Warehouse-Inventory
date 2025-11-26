/*
  # Create Inventory and Model Data Tables
  
  1. New Tables
    - `inventory_data`
      - `id` (uuid, primary key)
      - `product_id` (text) - product identifier
      - `store_id` (text) - store identifier
      - `date` (date) - transaction date
      - `inventory_level` (numeric) - current inventory level
      - `units_sold` (numeric) - actual units sold
      - `units_ordered` (numeric) - units ordered
      - `demand_forecast` (numeric) - forecasted demand
      - `predicted_units_sold` (numeric) - ML model prediction
      - `price` (numeric) - product price
      - `discount` (numeric) - discount percentage
      - `competitor_pricing` (numeric) - competitor price
      - `revenue` (numeric) - calculated revenue
      - `stock_movement` (numeric) - stock movement
      - `inventory_turnover` (numeric) - turnover rate
      - `category` (text) - product category
      - `region` (text) - store region
      - `weather_condition` (text) - weather condition
      - `seasonality` (text) - season
      - `holiday_promotion` (boolean) - promotion flag
      - `reorder_alert` (boolean) - reorder alert flag
      - `created_at` (timestamptz) - record creation timestamp
      
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key) - references users
      - `type` (text) - notification type
      - `title` (text) - notification title
      - `message` (text) - notification message
      - `read` (boolean) - read status
      - `created_at` (timestamptz) - notification timestamp
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users based on role
*/

CREATE TABLE IF NOT EXISTS inventory_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  store_id text NOT NULL,
  date date NOT NULL,
  inventory_level numeric NOT NULL DEFAULT 0,
  units_sold numeric NOT NULL DEFAULT 0,
  units_ordered numeric NOT NULL DEFAULT 0,
  demand_forecast numeric NOT NULL DEFAULT 0,
  predicted_units_sold numeric NOT NULL DEFAULT 0,
  price numeric NOT NULL DEFAULT 0,
  discount numeric NOT NULL DEFAULT 0,
  competitor_pricing numeric NOT NULL DEFAULT 0,
  revenue numeric NOT NULL DEFAULT 0,
  stock_movement numeric NOT NULL DEFAULT 0,
  inventory_turnover numeric NOT NULL DEFAULT 0,
  category text NOT NULL,
  region text NOT NULL,
  weather_condition text NOT NULL,
  seasonality text NOT NULL,
  holiday_promotion boolean DEFAULT false,
  reorder_alert boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, store_id, date)
);

CREATE INDEX IF NOT EXISTS idx_inventory_date ON inventory_data(date DESC);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory_data(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_store ON inventory_data(store_id);
CREATE INDEX IF NOT EXISTS idx_inventory_reorder ON inventory_data(reorder_alert) WHERE reorder_alert = true;

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('reorder', 'anomaly', 'system', 'forecast')),
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read) WHERE read = false;

ALTER TABLE inventory_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read inventory data"
  ON inventory_data FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin can insert inventory data"
  ON inventory_data FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admin can update inventory data"
  ON inventory_data FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);
