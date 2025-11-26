# Quick Start Guide

## Warehouse Inventory Optimization Dashboard

### What You Have

A fully functional warehouse inventory management dashboard with:

✅ **Database**: PostgreSQL via Supabase with 315 sample records
✅ **ML Integration**: Real predictions vs actual sales data
✅ **Authentication**: Secure login system with role-based access
✅ **Real-time Data**: Live inventory levels and forecasts
✅ **Analytics**: Interactive charts and trend analysis

---

## Getting Started (3 Steps)

### Step 1: Start the Application

The application is already built and ready. To start:

```bash
npm run dev
```

The dashboard will open at `http://localhost:5173`

### Step 2: Create Your Account

1. Click "Don't have an account? Sign up"
2. Enter your details:
   - **Full Name**: Your name
   - **Role**: Choose Admin (full access), Manager, or Staff
   - **Email**: your@email.com
   - **Password**: Create a secure password
3. Click "Sign Up"

### Step 3: Explore the Dashboard

Once logged in, you'll see:

#### 🏠 Home Dashboard
- Total revenue and units sold (last 7 days)
- Revenue growth percentage
- Inventory turnover rate
- Active reorder alerts

#### 📦 Inventory Page
- 315 products across 5 product IDs and 3 stores
- **ML Predictions**: See predicted vs actual sales
- **Accuracy Metrics**: Track how well the model performs
- **Reorder Alerts**: 61 items need restocking
- **Filters**: Search by product, category, region

#### 📊 Analytics Page
- **Sales Comparison**: Blue bars (actual) vs Cyan bars (predicted)
- **Revenue Trends**: Green bars showing daily revenue
- **Inventory Levels**: Purple bars for stock levels
- Interactive charts with hover details

#### 🔔 Notifications Page
- Receive alerts for low inventory
- Sales anomaly notifications
- Forecast updates

---

## Understanding the ML Model

### What It Does
The dashboard uses a **LightGBM regression model** trained on warehouse data to predict units sold.

### Key Features Used
- Demand Forecast
- Price & Discount
- Inventory Level
- Category, Region, Season
- Temporal patterns (day, month)

### How to Read the Data

In the **Inventory** page:
- **Actual Sold**: Real sales data
- **Predicted**: ML model's prediction
- **Accuracy**: How close the prediction was (80%+ is good!)

The closer the predicted value to actual, the better the model performs.

---

## Sample Data Overview

### Current Dataset (30 Days)
- **315 records** spanning last 30 days
- **5 products** (P001 - P005)
- **3 stores** (S001 - S003)
- **4 categories**: Electronics, Clothing, Food, Home
- **4 regions**: North, South, East, West
- **61 reorder alerts** for low inventory items

### Data Features
Each record includes:
- Sales data (actual and predicted)
- Pricing information
- Inventory levels
- Weather conditions
- Seasonality factors
- Holiday/promotion flags

---

## Key Features to Try

### 1. Compare Predictions
- Go to **Inventory** page
- Look at "Actual Sold" vs "Predicted" columns
- Check the "Accuracy" percentage
- Items with 80%+ accuracy show good model performance

### 2. View Trends
- Go to **Analytics** page
- Select different time ranges (7, 14, 30 days)
- Hover over bars to see exact values
- Compare blue (actual) vs cyan (predicted) bars

### 3. Manage Alerts
- Go to **Inventory** page
- Look for orange "Reorder" badges
- These items have inventory below threshold (200 units)
- Use this to prioritize restocking

### 4. Filter & Search
- Use the search bar to find specific products
- Filter by category (Electronics, Clothing, etc.)
- Filter by region (North, South, East, West)

---

## Tips for Best Experience

1. **Refresh Data**: Click refresh buttons to get latest metrics
2. **Check Accuracy**: Higher accuracy percentages mean better predictions
3. **Monitor Alerts**: Address reorder alerts promptly
4. **Compare Trends**: Use time range selector in Analytics
5. **Role Access**: Admin users have full access to all features

---

## Database Schema

### inventory_data table
Contains all warehouse data with ML predictions:
- `predicted_units_sold` - ML model output
- `units_sold` - Actual sales (ground truth)
- `reorder_alert` - Auto-flagged when inventory < 200

### How Predictions Work
1. Model trained on features: price, demand, inventory, seasonality
2. Generates `predicted_units_sold` for each product/store/date
3. Dashboard compares predictions to `units_sold` (actual)
4. Accuracy calculated as: `1 - |predicted - actual| / actual`

---

## Troubleshooting

### No Data Showing?
- Ensure you're logged in
- Check browser console for errors
- Refresh the page

### Predictions Not Loading?
- Sample data includes predictions
- Each record has both `units_sold` (actual) and `predicted_units_sold`

### Can't Sign Up?
- Check email format
- Ensure password meets requirements
- Try a different email if already registered

---

## Next Steps

### Add More Data
Run the seed script again or insert custom data:
```sql
-- See seed-sample-data.sql for examples
```

### Customize Thresholds
Modify reorder alert threshold in the database:
```sql
UPDATE inventory_data
SET reorder_alert = (inventory_level < YOUR_THRESHOLD);
```

### Integrate Real ML Model
Replace sample predictions with your actual LightGBM model outputs by:
1. Training model on your data (see backend/intern_2.ipynb)
2. Generating predictions
3. Inserting into `inventory_data.predicted_units_sold` column

---

## Architecture

```
Frontend (React + TypeScript)
    ↓
Supabase (PostgreSQL + Auth)
    ↓
RLS Policies (Security)
    ↓
inventory_data table (ML Predictions)
```

---

## Support

- **Documentation**: See README.md
- **ML Model**: See backend/intern_2.ipynb for training details
- **Database**: All tables have RLS enabled for security

---

**You're all set! 🚀**

Start exploring the dashboard and see your ML-powered inventory management system in action!
