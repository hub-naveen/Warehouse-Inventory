import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, TimeSeriesSplit, GridSearchCV
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import xgboost as xgb
import lightgbm as lgb
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import os

# Function for MAPE
def mean_absolute_percentage_error(y_true, y_pred): 
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    return np.mean(np.abs((y_true - y_pred) / (y_true + 1))) * 100

def train_models(data_path):
    print(f"Loading feature dataset from {data_path}...")
    df = pd.read_csv(data_path)
    df['Date'] = pd.to_datetime(df['Date'])
    
    # Preprocessing
    categorical_cols = ['Category', 'Region', 'Weather Condition', 'Holiday/Promotion', 'Seasonality']
    le_dict = {}
    for col in categorical_cols:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        le_dict[col] = le
    
    # Drop columns not suitable for training
    X = df.drop(['Date', 'Units Sold', 'Product ID', 'Store ID'], axis=1)
    y = df['Units Sold']
    
    # Time-series split (last 20% for test)
    split_idx = int(len(df) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]
    
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    results = []
    
    models = {
        'Linear Regression': (LinearRegression(), X_train_scaled, X_test_scaled),
        'Random Forest': (RandomForestRegressor(n_estimators=100, max_depth=10, n_jobs=-1), X_train, X_test),
        'XGBoost': (xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100), X_train, X_test),
        'LightGBM': (lgb.LGBMRegressor(n_estimators=100, force_col_wise=True), X_train, X_test)
    }
    
    best_model = None
    best_rmse = float('inf')
    best_name = ""
    
    os.makedirs('models', exist_ok=True)
    
    for name, (model, xtr, xte) in models.items():
        print(f"Training {name}...")
        model.fit(xtr, y_train)
        preds = model.predict(xte)
        
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        mae = mean_absolute_error(y_test, preds)
        mape = mean_absolute_percentage_error(y_test, preds)
        r2 = r2_score(y_test, preds)
        
        results.append({
            'Model': name,
            'RMSE': rmse,
            'MAE': mae,
            'MAPE': mape,
            'R2': r2
        })
        
        if rmse < best_rmse:
            best_rmse = rmse
            best_model = model
            best_name = name
            
    # Save results
    results_df = pd.DataFrame(results)
    print("\nModel Comparison:\n", results_df)
    results_df.to_csv('reports/model_performance.csv', index=False)
    
    # Save best model and artifacts
    model_pack = {
        'model': best_model,
        'scaler': scaler,
        'encoders': le_dict,
        'features': X.columns.tolist(),
        'model_name': best_name
    }
    joblib.dump(model_pack, 'models/best_model_pack.pkl')
    print(f"\nBest Model: {best_name} saved to models/best_model_pack.pkl")
    
    return results_df

if __name__ == "__main__":
    train_models('processed_data/feature_engineered_inventory.csv')
