# Warehouse Inventory Optimization Dashboard

A production-ready warehouse inventory management dashboard powered by Machine Learning predictions from a trained LightGBM model.

## Features

### Authentication & User Management
- Secure email/password authentication with Supabase
- Role-based access control (Admin, Manager, Staff)
- User profile management
- Password recovery support

### Dashboard Overview
- Real-time KPI metrics
  - Total Revenue with week-over-week comparison
  - Units Sold trends
  - Average Inventory Levels
  - Reorder Alert counts
- Inventory Turnover Rate tracking
- Quick insights and performance indicators

### Inventory Management
- Real-time inventory level monitoring
- ML model predictions vs actual sales
- Prediction accuracy tracking
- Advanced filtering by:
  - Product ID
  - Store ID
  - Category
  - Region
- Reorder alerts based on inventory thresholds
- Search functionality

### Analytics & Forecasts
- Time-series visualizations
  - Actual vs Predicted Sales comparison
  - Revenue trends
  - Inventory level trends
- Configurable time ranges (7, 14, 30 days)
- Interactive charts with hover details
- ML model performance insights

### Notifications
- Automated alerts for:
  - Low inventory (reorder alerts)
  - Sales anomalies
  - Forecast updates
  - System notifications
- Mark as read/unread functionality
- Real-time notification count

### Settings & Profile
- Notification preferences
- Security settings
- Display customization
- Profile information management

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** as build tool

### Backend & Database
- **Supabase** for:
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### ML Model
- **LightGBM** Regressor
- Features used:
  - Demand Forecast
  - Price & Discount
  - Units Ordered
  - Inventory Level
  - Competitor Pricing
  - Temporal features (Year, Month, Day of Week)
  - Categorical features (Category, Region, Weather, Seasonality)
  - Engineered features (Stock Movement, Inventory Turnover)

## Database Schema

### Tables

#### users
- `id` (uuid, primary key)
- `email` (text, unique)
- `full_name` (text)
- `role` (text: admin, manager, staff)
- `avatar_url` (text, nullable)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

#### inventory_data
- `id` (uuid, primary key)
- `product_id` (text)
- `store_id` (text)
- `date` (date)
- `inventory_level` (numeric)
- `units_sold` (numeric) - actual sales
- `units_ordered` (numeric)
- `demand_forecast` (numeric)
- `predicted_units_sold` (numeric) - ML model prediction
- `price` (numeric)
- `discount` (numeric)
- `competitor_pricing` (numeric)
- `revenue` (numeric)
- `stock_movement` (numeric)
- `inventory_turnover` (numeric)
- `category` (text)
- `region` (text)
- `weather_condition` (text)
- `seasonality` (text)
- `holiday_promotion` (boolean)
- `reorder_alert` (boolean)
- `created_at` (timestamptz)

#### notifications
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `type` (text: reorder, anomaly, system, forecast)
- `title` (text)
- `message` (text)
- `read` (boolean)
- `created_at` (timestamptz)

## Security

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:

- **Users**: Can read/update own profile only
- **Inventory Data**: All authenticated users can read; only admins can insert/update
- **Notifications**: Users can only see their own notifications

### Authentication
- JWT-based authentication via Supabase
- Secure password hashing
- Session management
- Protected API routes

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd warehouse-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Environment variables are already configured in `.env`:
```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

4. Database setup
The database schema has already been applied via migrations. Tables and RLS policies are configured.

5. Start development server
```bash
npm run dev
```

6. Build for production
```bash
npm run build
```

## Usage

### Creating an Account
1. Navigate to the login page
2. Click "Don't have an account? Sign up"
3. Enter your details and select a role
4. Sign in with your credentials

### Viewing Inventory
1. Navigate to the Inventory page
2. Use filters to narrow down products
3. View ML predictions vs actual sales
4. Check prediction accuracy
5. Monitor reorder alerts

### Analytics
1. Go to Analytics page
2. Select time range
3. View interactive charts showing:
   - Actual vs predicted sales
   - Revenue trends
   - Inventory levels
4. Hover over charts for detailed values

### Notifications
1. Click on Notifications in the navigation
2. View alerts for:
   - Low inventory items
   - Sales anomalies
   - Forecast updates
3. Click notifications to mark as read

## ML Model Integration

The dashboard integrates with a trained LightGBM model that predicts units sold based on various features:

### Model Performance
- R² Score: ~0.95 (model explains 95% of variance)
- MAE: Low prediction error
- Features: 50+ including numerical, temporal, and categorical

### Prediction Workflow
1. Historical data is collected in `inventory_data` table
2. ML model processes features to generate `predicted_units_sold`
3. Dashboard displays predictions alongside actual sales
4. Accuracy metrics help identify model performance
5. Alerts are generated based on prediction thresholds

## Design Philosophy

### Professional & Clean
- Modern, professional interface
- Consistent color scheme (blues, cyans, greens)
- Clear visual hierarchy
- Responsive design for all screen sizes

### User-Centric
- Intuitive navigation
- Quick access to key metrics
- Minimal clicks to important data
- Clear labeling and descriptions

### Data-Driven
- Real-time updates
- Visual trend analysis
- Actionable insights
- Performance tracking

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
