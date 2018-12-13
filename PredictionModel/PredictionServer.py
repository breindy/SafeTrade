# To install bottle to run server/router
# $ wget https://bottlepy.org/bottle.py
# Importing necessary tools and modules for building prediction model
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor

# Import pyhton http library
import requests
# Import python web framework bottle
from bottle import route, run
# To work with JSON objects returned from http calls
import json

# All API calls to IEX is prefixed with this base URL
iexUrl = 'https://api.iextrading.com/1.0'

AllDF = pd.read_csv('AllStockData.csv')

# Replacing infinite values with NaN and then
# Cleaning out the null or nan values
AllDF.replace([np.inf, -np.inf], np.nan)
AllDF.dropna()
# Dropping the 'NaN' rows that is read as string
AllDF = AllDF[~AllDF.isin(['NaN'])]

### Taking only the desired company data
df = AllDF.loc[AllDF['symbol'].isin(['AAL', 'AAPL', 'ATVI', 'BAC', 'BAM', 'CMCSA', 'CSCO', 'CVX', 'DAL', 'DCP', 'EARN', 'EBSB', 'F', 'FOXA', 'GBCI', 'HAYN', 'INTC', 'KCAP', 'JBLU', 'JNJ', 'JPM', 'LAND', 'MCD', 'MSFT', 'NVDA', 'OFC', 'PFE', 'QCOM', 'RAVN', 'RELL', 'SQM', 'SPR', 'T', 'TEVA', 'UNH', 'VZ', 'WFC', 'WMT', 'XOM', 'Y', 'YUM', 'ZEUS', 'ZBRA'])]

df['numberOfShare'] = df['marketcap'] / df['price']
df['profitPerShare'] = df['grossProfit'] / df['numberOfShare']

### Cleaning the dataframe df to have only features that have numeric values as well as 
# dividing the DataFrame in X(Features) and Y(Target)
X = df[['dividend', 'eps', 'numberOfShare', 'pe', 'profitPerShare', 'revenuePerShare']].copy()
Y = df.price

# Instantiate dt: n_estimators tells the model to make 25 different models and train them on different bootstrap
dt = RandomForestRegressor(n_estimators=25, random_state=2)

# Fit dt to the training set    
dt.fit(X, Y)

### Handling the http request
@route('/<ticker>')
def hello(ticker):
	
	response = requests.get(iexUrl + '/stock/' + ticker +'/price')
	print(response.json())
	return response

run(host='localhost', port=8080, debug=True)
