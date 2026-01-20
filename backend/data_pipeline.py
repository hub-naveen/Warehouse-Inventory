import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
import os

def clean_data(input_path, output_path):
    print(f"Loading data from {input_path}...")
    df = pd.read_csv(input_path)
    
    # 1. Date parsing
    print("Parsing dates...")
    df['Date'] = pd.to_datetime(df['Date'])
    
    # 2. Handle missing values
    print("Handling missing values...")
    # For numeric: fill with median
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())
    
    # For categorical: fill with mode
    categorical_cols = df.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        df[col] = df[col].fillna(df[col].mode()[0])
        
    # 3. Outlier treatment (using IQR method)
    print("Treating outliers...")
    for col in numeric_cols:
        Q1 = df[col].quantile(0.25)
        Q3 = df[col].quantile(0.75)
        IQR = Q3 - Q1
        lower_bound = Q1 - 1.5 * IQR
        upper_bound = Q3 + 1.5 * IQR
        # Clip values to bounds
        df[col] = np.clip(df[col], lower_bound, upper_bound)
        
    # 4. Encoding categorical features
    print("Encoding categorical features...")
    # We'll keep original and add encoded columns for flexibility
    le = LabelEncoder()
    for col in categorical_cols:
        df[col + '_encoded'] = le.fit_transform(df[col].astype(str))
        
    # 5. Scaling numeric features
    print("Scaling numeric features...")
    scaler = StandardScaler()
    # Create a copy for scaled values or just scale in place? 
    # Usually production pipelines might want both, but user said "Scaling numeric features"
    df[numeric_cols] = scaler.fit_transform(df[numeric_cols])
    
    # 6. Save processed data
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Successfully saved cleaned data to {output_path}")

if __name__ == "__main__":
    # In a real production system, we might loop through all files in 'data'
    # For now, we process the main inventory CSV
    input_file = 'data/retail_store_inventory (1).csv'
    output_file = 'processed_data/cleaned_inventory.csv'
    
    if os.path.exists(input_file):
        clean_data(input_file, output_file)
    else:
        print(f"Input file {input_file} not found.")
