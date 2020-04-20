import pandas as pd
from collections import defaultdict

vehicles = pd.read_csv("vehiclesdataset.csv",low_memory=False)
emissions = pd.read_csv("emissions.csv")

# data = vehicles.merge(emissions, on="id")

vehicles = vehicles[vehicles.mpgData == 'Y']
vehicles = vehicles.groupby(['fuelType','year','VClass', 'highway08','fuelCost08'])['city08'].mean().to_csv('output_file.csv')