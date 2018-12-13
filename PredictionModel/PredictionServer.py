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
AllDF.replace([np.inf, -np.inf], np.nan)
# Cleaning out the null or nan values
AllDF.dropna()
# Dropping the 'NaN' rows that is read as string
AllDF = AllDF[~AllDF.isin(['NaN'])]

### Taking only the desired company data
df = AllDF.loc[AllDF['symbol'].isin(['AAL', 'AAPL', 'ATVI', 'BAC', 'BAM', 'CMCSA', 'CSCO', 'CVX', 'DAL', 'DCP', 'EARN', 'EBSB', 'F', 'FOXA', 'GBCI', 'HAYN', 'INTC', 'KCAP', 'JBLU', 'JNJ', 'JPM', 'LAND', 'MCD', 'MSFT', 'NVDA', 'OFC', 'PFE', 'QCOM', 'RAVN', 'RELL', 'SQM', 'SPR', 'T', 'TEVA', 'UNH', 'VZ', 'WFC', 'WMT', 'XOM', 'Y', 'YUM', 'ZEUS', 'ZBRA'])]

## Converting marketcap to numberOfShare
df['numberOfShare'] = df['marketcap'] / df['price']
## Converting grossProfit to profitPerShare
df['profitPerShare'] = df['grossProfit'] / df['numberOfShare']

### Cleaning the dataframe df to have only features that have numeric values as well as
# dividing the DataFrame in X(Features) and Y(Target)
X = df[['dividend', 'eps', 'grossProfit', 'marketcap', 'revenuePerShare']].copy()
Y = df.price

# Instantiate dt: n_estimators tells the model to make 25 different models and train them on different bootstrap fo training examples
dt = RandomForestRegressor(n_estimators=25, random_state=2)

# Fit dt to the training set
dt.fit(X, Y)

### Handling the http request
@route('/<ticker>')
def hello(ticker):
	y = requests.get(iexUrl + '/stock/' + ticker +'/price')
	return y

	status = True	# to flag if prediction can be made
	x = pd.DataFrame(columns=list(['dividend', 'eps', 'grossProfit', 'marketcap', 'revenuePerShare']))
	## Making API call to get EPS for the symbol
	response = requests.get(iexUrl + '/stock/' + ticker + '/earnings')
	JSONdata = response.json()
	# Making sure if the fetched data have a component 'earnings' otherwise status is set to False
	if 'earnings' in JSONdata:
		# making sure earning contains valid values
		if isinstance(JSONdata['earnings'][0]['actualEPS'], numbers.Number):
			x['eps'] = JSONdata['earnings'][0]['actualEPS']
		else:
			# If actualEPS is not there
			status = False
	else:
		status = False


	## Making API call to get last one year querterly dividends
	if status:
		response = requests.get(iexUrl + '/stock/' + symbol + '/dividends/1y')
		JSONdata = response.json()
		# Considering only those stocks for which there was at least one dividend declaration in last one year
		if len(JSONdata)>0:
			# making sure amount contains valid values
			if isinstance(JSONdata[0]['amount'], numbers.Number):
				x['dividend'] = JSONdata[0]['amount']
			else:
				status = False
		else:
			status = False


	## Making API call to get last one year grossProfit=profitPerShare
	if status:
		response = requests.get(iexUrl + '/stock/' + ticker + '/financials?period=annual')
		JSONdata = response.json()
		if 'financials' in JSONdata:
			if not JSONdata['financials']['grossProfit'] is None:
				x['grossProfit'] = JSONdata['financials']['grossProfit']
			else:
				status = False
		else:
			status = False


	## Making API call to get last one year marketcap and revenuePerShare
	if status:
		response = requests.get(iexUrl + '/stock/' + symbol + '/stats')
		JSONdata = response.json()
		# If marketcap and revenuePerShare amount is not valid value
		if isinstance(JSONdata['marketcap'], numbers.Number) or not isinstance(JSONdata['revenuePerShare'], numbers.Number):
			x['marketcap'] = JSONdata['marketcap']
			x['revenuePerShare'] = JSONdata['revenuePerShare']
		else:
			status = False
	else:
		status = False

	if status:
		return dt.predict(x)
	else:
		return "All features not available: prediction cannot be made!"

run(host='localhost', port=8080, debug=True)
