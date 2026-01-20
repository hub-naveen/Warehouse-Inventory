from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
import plotly.express as px
import plotly.graph_objects as go
import json
import os
from typing import List, Optional

app = FastAPI(title="Warehouse Inventory Intelligence API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data and model
# Using raw data for now as fallback if processed isn't ideal, but prefer processed
DATA_PATH = 'processed_data/feature_engineered_inventory.csv'
RAW_DATA_PATH = 'data/retail_store_inventory (1).csv'

def get_data():
    if os.path.exists(DATA_PATH):
        df = pd.read_csv(DATA_PATH)
    elif os.path.exists(RAW_DATA_PATH):
        df = pd.read_csv(RAW_DATA_PATH)
        # Basic cleanup if using raw
        df['Date'] = pd.to_datetime(df['Date'])
    else:
        raise FileNotFoundError("Data file not found")
    
    # Ensure Date is datetime
    if 'Date' in df.columns and not pd.api.types.is_datetime64_any_dtype(df['Date']):
        df['Date'] = pd.to_datetime(df['Date'])
    return df

@app.get("/")
def read_root():
    return {"message": "Warehouse Intelligence API is running"}

# --- 1. Dashboard KPIs ---
@app.get("/dashboard_kpis")
def get_dashboard_kpis():
    df = get_data()
    
    total_revenue = (df['Units Sold'] * df['Price']).sum()
    total_units_sold = df['Units Sold'].sum()
    avg_inventory = df['Inventory Level'].mean()
    
    # Low stock items (assuming logic: Inventory < 20% of demand forecast or fixed threshold)
    # Using simple threshold for now if Demand Forecast is missing 0 or null
    low_stock_threshold = 50 
    low_stock_count = df[df['Inventory Level'] < low_stock_threshold].shape[0]
    
    # Inventory Turnover = Cost of Goods Sold / Avg Inventory (Simple proxy: Units Sold / Avg Inventory Level)
    inventory_turnover = total_units_sold / avg_inventory if avg_inventory > 0 else 0
    
    return {
        "total_revenue": f"${total_revenue:,.2f}",
        "total_units_sold": int(total_units_sold),
        "low_stock_count": int(low_stock_count),
        "inventory_turnover": round(inventory_turnover, 2),
        "active_products": df['Product ID'].nunique(),
        "total_stores": df['Store ID'].nunique()
    }

# --- 2. Inventory Table ---
@app.get("/inventory_table")
def get_inventory_table(
    page: int = 1, 
    limit: int = 10, 
    category: Optional[str] = None, 
    region: Optional[str] = None,
    product_id: Optional[str] = None
):
    df = get_data()
    
    # Filters
    filtered_df = df
    if category and category != "All":
        filtered_df = filtered_df[filtered_df['Category'] == category]
    if region and region != "All":
        filtered_df = filtered_df[filtered_df['Region'] == region]
    if product_id:
        filtered_df = filtered_df[filtered_df['Product ID'].str.contains(product_id, case=False)]
        
    total_records = len(filtered_df)
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    
    # Select relevant columns for table
    display_cols = ['Date', 'Store ID', 'Product ID', 'Category', 'Region', 'Inventory Level', 'Units Sold', 'Price', 'Demand Forecast']
    # Check if columns exist
    cols = [c for c in display_cols if c in filtered_df.columns]
    
    paginated_df = filtered_df[cols].iloc[start:end]
    
    return {
        "data": paginated_df.to_dict(orient="records"),
        "total": total_records,
        "page": page,
        "limit": limit
    }

@app.get("/filter_options")
def get_filter_options():
    df = get_data()
    return {
        "categories": ["All"] + sorted(df['Category'].dropna().unique().tolist()),
        "regions": ["All"] + sorted(df['Region'].dropna().unique().tolist())
    }

# --- 3. Demand Forecast ---
@app.get("/demand_forecast")
def get_demand_forecast(product_id: Optional[str] = None):
    df = get_data()
    
    # Aggregating for overall view if no product selected
    if product_id and product_id != "All":
        df = df[df['Product ID'] == product_id]
        
    # Aggregate sales by date
    daily_sales = df.groupby('Date')[['Units Sold', 'Demand Forecast']].sum().reset_index()
    daily_sales = daily_sales.sort_values('Date')
    
    # Plotly Chart
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=daily_sales['Date'], y=daily_sales['Units Sold'], mode='lines', name='Actual Sales'))
    
    if 'Demand Forecast' in daily_sales.columns:
        fig.add_trace(go.Scatter(x=daily_sales['Date'], y=daily_sales['Demand Forecast'], mode='lines', name='Predicted Demand', line=dict(dash='dash')))
        
    fig.update_layout(
        title="Demand Forecast vs Actual Sales",
        xaxis_title="Date",
        yaxis_title="Units",
        template="plotly_dark",
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        hovermode="x unified"
    )
    
    return json.loads(fig.to_json())

# --- 4. Optimization Recommendations ---
@app.get("/optimization_recommendation")
def get_optimization(category: Optional[str] = None):
    df = get_data()
    
    if category and category != "All":
        df = df[df['Category'] == category]
        
    # Calculate EOQ (Economic Order Quantity)
    # EOQ = sqrt( (2 * Demand * OrderCost) / HoldingCost )
    # Assumptions: 
    # Annual Demand = Daily Demand * 365
    # Order Cost = Fixed $50 (Assumption)
    # Holding Cost = 20% of Price (Assumption)
    
    # Aggregate data per product
    product_agg = df.groupby(['Product ID', 'Category', 'Price']).agg({
        'Units Sold': 'mean', # Daily avg demand
        'Inventory Level': 'last'
    }).reset_index()
    
    product_agg.rename(columns={'Units Sold': 'Daily Demand'}, inplace=True)
    
    ORDER_COST = 50
    HOLDING_COST_RATE = 0.2
    
    optimization_data = []
    
    for _, row in product_agg.iterrows():
        annual_demand = row['Daily Demand'] * 365
        holding_cost = row['Price'] * HOLDING_COST_RATE
        
        if holding_cost > 0 and annual_demand > 0:
            eoq = np.sqrt((2 * annual_demand * ORDER_COST) / holding_cost)
        else:
            eoq = 0
            
        # Reorder Point (ROP) = demand during lead time + safety stock
        # Lead time assumption: 7 days
        # Safety Stock assumption: 50 units
        lead_time_demand = row['Daily Demand'] * 7
        rop = lead_time_demand + 50
        
        status = "Good"
        if row['Inventory Level'] < rop:
            status = "Reorder Now"
        elif row['Inventory Level'] > rop * 3:
            status = "Overstocked"
            
        optimization_data.append({
            "Product ID": row['Product ID'],
            "Category": row['Category'],
            "Current Stock": int(row['Inventory Level']),
            "EOQ": int(eoq),
            "ROP": int(rop),
            "Status": status
        })
        
    return optimization_data

# --- 5. Analytics Charts ---
@app.get("/analytics_charts")
def get_analytics_charts(type: str):
    df = get_data()
    
    if type == "category_distribution":
        cat_dist = df.groupby('Category')['Units Sold'].sum().reset_index()
        fig = px.pie(cat_dist, names='Category', values='Units Sold', title="Sales by Category", hole=0.4, template="plotly_dark")
        fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        return json.loads(fig.to_json())
        
    elif type == "region_sales":
        reg_sales = df.groupby('Region')['Units Sold'].sum().reset_index()
        fig = px.bar(reg_sales, x='Region', y='Units Sold', color='Units Sold', title="Sales by Region", template="plotly_dark")
        fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        return json.loads(fig.to_json())
        
    elif type == "inventory_gauge":
        avg_stock = df['Inventory Level'].mean()
        fig = go.Figure(go.Indicator(
            mode = "gauge+number",
            value = avg_stock,
            title = {'text': "Avg Inventory Level"},
            gauge = {
                'axis': {'range': [None, 500]},
                'bar': {'color': "darkblue"},
                'steps': [
                    {'range': [0, 100], 'color': "red"},
                    {'range': [100, 300], 'color': "yellow"},
                    {'range': [300, 500], 'color': "green"}
                ]
            }
        ))
        fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font={'color': "white"})
        return json.loads(fig.to_json())
        
    elif type == "cost_optimization_curve":
        # Theoretical curve simulation for EOQ
        order_quantities = np.linspace(10, 500, 50)
        demand = 1000 # dummy annual
        order_cost = 50
        holding_cost_unit = 2
        
        ordering_costs = (demand / order_quantities) * order_cost
        holding_costs = (order_quantities / 2) * holding_cost_unit
        total_costs = ordering_costs + holding_costs
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=order_quantities, y=ordering_costs, name='Ordering Cost'))
        fig.add_trace(go.Scatter(x=order_quantities, y=holding_costs, name='Holding Cost'))
        fig.add_trace(go.Scatter(x=order_quantities, y=total_costs, name='Total Cost', line=dict(width=4)))
        
        fig.update_layout(
            title="Cost Optimization Curve (EOQ Theory)",
            xaxis_title="Order Quantity",
            yaxis_title="Cost",
            template="plotly_dark",
            paper_bgcolor='rgba(0,0,0,0)',
            plot_bgcolor='rgba(0,0,0,0)'
        )
        return json.loads(fig.to_json())

    return {"error": "Invalid chart type"}

