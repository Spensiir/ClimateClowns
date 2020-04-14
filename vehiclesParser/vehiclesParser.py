import pandas as pd
from collections import defaultdict

vehicles = pd.read_csv("vehiclesdataset.csv",low_memory=False)
emissions = pd.read_csv("emissions.csv")

data = vehicles.merge(emissions, on="id")

mpgData = data['mpgData'] == 'Y'


reg = data[mpgData]
# scoreData = reg['score'] != None
# reg = reg[scoreData]
# reg = reg.groupby(['year']).groups
reg = reg.groupby(['fuelType','year','VClass', 'highway08','fuelCost08', 'score'])['city08'].mean().to_csv('output_file.csv')
# regC = reg['year']('city08').mean()
# regH = reg.groupby('year')['highway08'].mean()


# prem = data[data['fuelType'] == 'Premium']
# prem = prem[mpgData]
# premC = prem.groupby('year')['city08'].mean()
# premH = prem.groupby('year')['highway08'].mean()

# dies = data[data['fuelType'] == 'Diesel']
# nat = data[data['fuelType'] == 'CNG']
print(reg)
# print(regH)
# print(premC)
# print(premH)