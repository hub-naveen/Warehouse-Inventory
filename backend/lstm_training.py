import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from sklearn.preprocessing import StandardScaler
import os
import joblib

def prepare_lstm_data(df, time_steps=7):
    # Select features (numerical)
    # Using the same features as classical models
    features = [c for c in df.columns if c not in ['Date', 'Units Sold', 'Product ID', 'Store ID']]
    X_raw = df[features].values
    y_raw = df['Units Sold'].values
    
    # Scaling
    scaler_x = StandardScaler()
    scaler_y = StandardScaler()
    X_scaled = scaler_x.fit_transform(X_raw)
    y_scaled = scaler_y.fit_transform(y_raw.reshape(-1, 1))
    
    X, y = [], []
    for i in range(time_steps, len(df)):
        X.append(X_scaled[i-time_steps:i])
        y.append(y_scaled[i])
        
    return np.array(X), np.array(y), scaler_x, scaler_y, features

def train_lstm(data_path):
    print("Preparing data for LSTM...")
    df = pd.read_csv(data_path)
    # Filter for one product/store to make it faster/simpler for demo or handle group-wise
    # For a baseline, we'll take a subset or just a sample to avoid memory issues
    df_small = df.iloc[:10000] # Take first 10k rows for demonstration
    
    X, y, scaler_x, scaler_y, features = prepare_lstm_data(df_small)
    
    split = int(0.8 * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    
    print("Building LSTM model...")
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
        Dropout(0.2),
        LSTM(50),
        Dropout(0.2),
        Dense(1)
    ])
    
    model.compile(optimizer='adam', loss='mse')
    
    print("Training LSTM...")
    model.fit(X_train, y_train, epochs=5, batch_size=32, validation_split=0.1, verbose=1)
    
    loss = model.evaluate(X_test, y_test)
    print(f"LSTM Test Loss: {loss}")
    
    os.makedirs('models', exist_ok=True)
    model.save('models/lstm_model.h5')
    joblib.dump({'scaler_x': scaler_x, 'scaler_y': scaler_y, 'features': features}, 'models/lstm_artifacts.pkl')
    print("LSTM Model and artifacts saved.")

if __name__ == "__main__":
    train_lstm('processed_data/feature_engineered_inventory.csv')
