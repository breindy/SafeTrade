# Import necessary python modules to equip ourselves with better tools
# Import library for data manipulation
import pandas as pd
# Import pyhton http library
import requests
# To work with JSON objects returned from http calls
import json

# Declaring the main dataframe that we will be manipulating throughout the model building process 
df = pd.DataFrame(columns=['date', 'company', 'symbol', 'dividend', 'eps', 'grossProfit', 'nasdaqIndex', 'marketcap', 'pe', 'price', 'revenuePerShare'])


### Populating df with data for Apple Inc.
tempdf = pd.DataFrame(columns=['date', 'company', 'symbol', 'dividend', 'eps', 'grossProfit', 'marketcap', 'pe', 'price', 'revenuePerShare'])

# Making API call to get last one year end of day close price(target value) and transaction date for AAPL
response = requests.get(iexUrl + '/stock/aapl/chart/1y')
JSONdata = response.json()
date = list()
price = list()
for data in JSONdata:
    date.append(data['date'])
    price.append(data['close'])
tempdf.date = date
tempdf.price = price
tempdf.company = 'Apple Inc.'
tempdf.symbol = 'AAPL'

# Making API call to get last one year querterly EPS
response = requests.get(iexUrl + '/stock/aapl/earnings')
JSONdata = response.json()
totalEPS = 0 # to set the null EPS later

# Setting EPS values for transaction days that happened after the EPS reporting date
for data in JSONdata['earnings']:
    tempdf.loc[tempdf['date'] > data['EPSReportDate'], ['eps']] = data['actualEPS']
    totalEPS += data['actualEPS']
    
# Setting NaN values in EPS to avarage of last four EPS
tempdf.loc[pd.isnull(tempdf['eps']), ['eps']] = totalEPS / len(JSONdata['earnings'])

# Calculating pe
tempdf['pe'] = tempdf['price'] / tempdf['eps']

# Making API call to get last one year querterly dividends
response = requests.get(iexUrl + '/stock/aapl/dividends/1y')
JSONdata = response.json()
totalDividend = 0 # to set the null dividend later

# Setting dividend values for transaction days that happened after the dividend declaredDate
for data in JSONdata:
    tempdf.loc[tempdf['date'] > data['declaredDate'], ['dividend']] = data['amount']
    totalDividend += data['amount']
    
# Setting NaN values in dividend to avarage of last four dividend amount
tempdf.loc[pd.isnull(tempdf['dividend']), ['dividend']] = totalDividend / len(JSONdata)

# Making API call to get last one year marketcap and revenuePerShare
response = requests.get(iexUrl + '/stock/aapl/stats')
JSONdata = response.json()

tempdf['marketcap'] = JSONdata['marketcap']
tempdf['revenuePerShare'] = JSONdata['revenuePerShare']

# Making API call to get last one year grossProfit
response = requests.get(iexUrl + '/stock/aapl/financials?period=annual')
JSONdata = response.json()

totalgrossProfit = 0 # to set the null grossProfit later

# Setting grossProfit values for transaction days that happened after the grossProfit report date
for data in JSONdata['financials']:
    tempdf.loc[tempdf['date'] > data['reportDate'], ['grossProfit']] = data['grossProfit']
    totalgrossProfit += data['grossProfit']
    
# Setting NaN values in grossProfit to avarage of last four grossProfit
tempdf.loc[pd.isnull(tempdf['grossProfit']), ['grossProfit']] = totalgrossProfit / len(JSONdata['financials'])

# Concatenating Apple dataframe to the main dataframe df
df = pd.concat([df, tempdf], ignore_index=True)


### Save all stock data in a CSV file called 'StockData.csv'
df.to_csv('StockData.csv')
