import pandas as pd

data = pd.read_csv("vehiclesdataset.csv",low_memory=False)
mpgData = data['mpgData'] == 'Y'

reg = data[mpgData]
# reg = reg.groupby(['year']).groups
reg = reg.groupby(['fuelType','year','VClass'])['city08'].mean().to_csv('output_file.csv')
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