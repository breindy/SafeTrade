'''
Before running this script to aggregate all stock data into StockData.csv, 
it is strongly recommended that NasdaqIndices.csv be updated from here: 
https://finance.yahoo.com/quote/%5EIXIC/history?ltr=1
'''

### Import necessary python modules to equip ourselves with magnificant tools

# To work with JSON objects returned from http calls
import json
# Import library for data manipulation
import pandas as pd
# Import pyhton http library
import requests


# All API calls to IEX is prefixed with this base URL
iexUrl = 'https://api.iextrading.com/1.0'


### Declaring the main dataframe that we will be manipulating throughout the model building process 
df = pd.DataFrame(columns=['date', 'company', 'symbol', 'dividend', 'eps', 'grossProfit', 'nasdaqIndex', 'marketcap', 'pe', 'price', 'revenuePerShare'])


# Fetching all valid ticker symbols to populate the dataframe for each symbol with a year round transactions
allCompanies = requests.get(iexUrl + '/ref-data/symbols').json()


### Populating the dataframe with stock data of one year for each company
for company in allCompanies:
	## if the symbol is enabled for trading on IEX
	if company['isEnabled']:
		## Declaring symbolDF to hold data for this symbol only
		symbolDF = pd.DataFrame(columns=['date', 'company', 'symbol', 'dividend', 'eps', 'grossProfit', 'nasdaqIndex', 'marketcap', 'pe', 'price', 'revenuePerShare'])

		# To flag if the company has all the necessary features the model is looking for
		status = True

		symbol = company['symbol']
		name = company['name']
		
		## Making API call to get last one year end of day close price(target value) and transaction date for each symbol
		response = requests.get(iexUrl + '/stock/' + symbol + '/chart/1y')
		JSONdata = response.json()

		# Declare a list to hold each transaction date
		date = list()
		# Declare a list to hold each transaction price
		price = list()

		# Populate the placeholders date and price and then add them to the symbolDF
		for data in JSONdata:
			date.append(data['date'])
			price.append(data['close'])
		symbolDF.date = date
		symbolDF.price = price
		symbolDF.company = name
		symbolDF.symbol = symbol

		## Making API call to get last one year querterly EPS for each symbol
		response = requests.get(iexUrl + '/stock/' + symbol + '/earnings')
		JSONdata = response.json()

		# Accumalate all EPS to set the null values to average EPS for the year
		totalEPS = 0

		# Setting EPS values for transaction days that happened after the EPS reporting date
		if 'earnings' in JSONdata:
			for data in JSONdata['earnings']:
				if data['actualEPS'] is None:
					data['actualEPS'] = 0
				symbolDF.loc[symbolDF['date'] > data['EPSReportDate'], ['eps']] = data['actualEPS']
				totalEPS += data['actualEPS']

			# Setting NaN values in EPS to avarage of last four EPS
			symbolDF.loc[pd.isnull(symbolDF['eps']), ['eps']] = totalEPS / len(JSONdata['earnings'])
		else:
			status = False


		# Concatenating the symbolDF to the main dataframe df
		if status:
			df = pd.concat([df, symbolDF], ignore_index=True, sort=False)







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



### Save all stocks data in a CSV file called 'StockData.csv'
df.to_csv('StockData.csv')
print('All data written to StockData.csv successfully )-:')
