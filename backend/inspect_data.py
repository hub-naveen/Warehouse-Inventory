import pandas as pd
import numpy as np

# Load data
df = pd.read_csv('data/retail_store_inventory (1).csv')

# Basic info
with open('reports/initial_data_inspection.txt', 'w') as f:
    f.write("--- Data Information ---\n")
    f.write(str(df.info()) + "\n\n")
    f.write("--- Columns ---\n")
    f.write(str(df.columns.tolist()) + "\n\n")
    f.write("--- Missing Values ---\n")
    f.write(str(df.isnull().sum()) + "\n\n")
    f.write("--- Statistics ---\n")
    f.write(str(df.describe(include='all')) + "\n")

print("Inspection report saved to reports/initial_data_inspection.txt")
print("Columns:", df.columns.tolist())
