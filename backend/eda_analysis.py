import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Set style
sns.set(style="whitegrid")
plt.rcParams['figure.figsize'] = (12, 8)

# Create visualizations directory if it doesn't exist
os.makedirs('visualizations', exist_ok=True)

# Load data
df = pd.read_csv('data/retail_store_inventory (1).csv')

# Preprocessing for EDA
df['Date'] = pd.to_datetime(df['Date'])
df['Year'] = df['Date'].dt.year
df['Month'] = df['Date'].dt.month
df['Day'] = df['Date'].dt.day

numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
categorical_cols = df.select_dtypes(exclude=[np.number, 'datetime64[ns]']).columns.tolist()

print("--- Univariate Analysis ---")
for col in numeric_cols:
    plt.figure()
    sns.histplot(df[col], kde=True)
    plt.title(f'Distribution of {col}')
    plt.savefig(f'visualizations/univariate_{col.replace("/", "_").replace(" ", "_")}.png')
    plt.close()

for col in categorical_cols:
    if df[col].nunique() < 20:
        plt.figure()
        sns.countplot(y=df[col])
        plt.title(f'Count of {col}')
        plt.savefig(f'visualizations/univariate_{col.replace("/", "_").replace(" ", "_")}.png')
        plt.close()

print("--- Bivariate Analysis ---")
# Units Sold vs Category
plt.figure()
sns.boxplot(x='Category', y='Units Sold', data=df)
plt.title('Units Sold by Category')
plt.xticks(rotation=45)
plt.savefig('visualizations/bivariate_units_sold_category.png')
plt.close()

# Units Sold vs Region
plt.figure()
sns.boxplot(x='Region', y='Units Sold', data=df)
plt.title('Units Sold by Region')
plt.savefig('visualizations/bivariate_units_sold_region.png')
plt.close()

# Sales (derived) or Price vs Category
plt.figure()
sns.barplot(x='Category', y='Price', data=df)
plt.title('Average Price by Category')
plt.xticks(rotation=45)
plt.savefig('visualizations/bivariate_price_category.png')
plt.close()

print("--- Multivariate Analysis ---")
# Correlation Heatmap
plt.figure(figsize=(12,10))
sns.heatmap(df[numeric_cols].corr(), annot=True, cmap='coolwarm', fmt=".2f")
plt.title('Correlation Heatmap')
plt.savefig('visualizations/multivariate_correlation_heatmap.png')
plt.close()

print("--- Seasonal Trends ---")
# Monthly Units Sold
monthly_sales = df.groupby('Month')['Units Sold'].sum().reset_index()
plt.figure()
sns.lineplot(x='Month', y='Units Sold', data=monthly_sales, marker='o')
plt.title('Monthly Units Sold Trend')
plt.savefig('visualizations/trend_monthly_units_sold.png')
plt.close()

# Units Sold by Seasonality
plt.figure()
sns.barplot(x='Seasonality', y='Units Sold', data=df)
plt.title('Average Units Sold by Season')
plt.savefig('visualizations/bivariate_units_sold_seasonality.png')
plt.close()

print("--- Region-wise and Category-wise Analysis ---")
# Region vs Category Heatmap of Units Sold
pivot_table = df.pivot_table(index='Region', columns='Category', values='Units Sold', aggfunc='sum')
plt.figure(figsize=(14,8))
sns.heatmap(pivot_table, annot=True, fmt=".0f", cmap='YlGnBu')
plt.title('Total Units Sold: Region vs Category')
plt.savefig('visualizations/multivariate_region_category_sales.png')
plt.close()

print("EDA Analysis complete. Visualizations saved to visualizations/ folder.")
