'''
Before running this script to aggregate all stock data into StockData.csv file,
it is strongly recommended that NasdaqIndices.csv be updated from here:
https://finance.yahoo.com/quote/%5EIXIC/history?ltr=1
'''

### Import necessary python modules to equip ourselves with magnificant tools
# To enforce float quotient
from __future__ import division
# Import pyhton http library
import requests
# To work with JSON objects returned from http calls
import json
# Import library for data manipulation
import pandas as pd
# For helping with sophistacated calculations
import numpy as np
# To avail sleep() functionality
import time
# To check the validity of fetched values
import numbers

# All API calls to IEX is prefixed with this base URL
iexUrl = 'https://api.iextrading.com/1.0'

### Declaring the main dataframe that we will be manipulating throughout the model building process
df = pd.DataFrame(columns=['date', 'company', 'symbol', 'dividend', 'eps', 'nasdaqIndex', 'numberOfShare', 'pe', 'price', 'profitPerShare', 'revenuePerShare'])

#### Fetching all valid ticker symbols to populate the dataframe for each symbol with a year round transactions
allCompanies = requests.get(iexUrl + '/ref-data/symbols').json()
# To test with certain companies
#allCompanies = [{"name": "Apple Inc.", "symbol": "AAPL", "isEnabled": True}, {"name": "Google", "symbol": "GOOG", "isEnabled": True}]


### Populating the dataframe with stock data of one year for each company
for company in allCompanies:
    ## if the symbol is enabled for trading on IEX
    if company['isEnabled']:
        ## Declaring symbolDF to hold data for this symbol only
        symbolDF = pd.DataFrame(columns=['date', 'company', 'symbol', 'dividend', 'eps', 'nasdaqIndex', 'numberOfShare', 'pe', 'price', 'profitPerShare', 'revenuePerShare'])

        # To flag if the company has all the necessary features the model needs
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

        # To accumalate all EPS to set the null values to average EPS for the year
        totalEPS = 0

        # Making sure if the fetched data have a component 'earnings' otherwise status is set to False
        if 'earnings' in JSONdata:
            for data in JSONdata['earnings']:
                # making sure earning contains valid values
                if not isinstance(data['actualEPS'], numbers.Number):
                    # If actualEPS is not there
                    data['actualEPS'] = 0
                # Setting EPS values for transaction days that happened after the EPS reporting date
                symbolDF.loc[symbolDF['date'] > data['EPSReportDate'], ['eps']] = data['actualEPS']
                totalEPS += data['actualEPS']

            # Setting NaN values in EPS to avarage of last four EPS
            symbolDF.loc[pd.isnull(symbolDF['eps']), ['eps']] = totalEPS / len(JSONdata['earnings'])
        else:
            status = False
            print('status set to false in eps fetching step for', symbol)


        ## Assigning pe values
        # For eps values==0, dividing price with a very small value close to zero
        if status:
            symbolDF['pe'] = symbolDF['price'].div(symbolDF['eps'] != 0, np.nextafter(0,1))


        ## Making API call to get last one year querterly dividends
        if status:
            response = requests.get(iexUrl + '/stock/' + symbol + '/dividends/1y')
            JSONdata = response.json()

            # Considering only those stocks for which there was at least one dividend declaration in last one year
            if len(JSONdata)>0:
                # To accumalate all dividends to set the null values to average dividend for the year
                totalDividend = 0

                for data in JSONdata:
                    # making sure amount contains valid values
                    if not isinstance(data['amount'], numbers.Number):
                        data['amount'] = 0
                    # Setting dividend values for transaction days that happened after the dividend declaration date
                    symbolDF.loc[symbolDF['date'] > data['declaredDate'], ['dividend']] = data['amount']
                    totalDividend += data['amount']
                # Setting NaN values in dividend to avarage of last four dividend amount
                symbolDF.loc[pd.isnull(symbolDF['dividend']), ['dividend']] = totalDividend / len(JSONdata)
            else:
                status = False
                print('status set to false in dividend fetching step for', symbol)


        ## Making API call to get last one year marketcap/price=numberOfShare and revenuePerShare
        if status:
            response = requests.get(iexUrl + '/stock/' + symbol + '/stats')
            JSONdata = response.json()

            # If marketcap and revenuePerShare amount is not valid value
            if not isinstance(JSONdata['marketcap'], numbers.Number) or not isinstance(JSONdata['revenuePerShare'], numbers.Number):
                status = False
                print('status set to false in marketcap and revenuePerShare fetching step for', symbol)
            else:
                symbolDF['numberOfShare'] = JSONdata['marketcap'] / symbolDF['price']
                symbolDF['revenuePerShare'] = JSONdata['revenuePerShare']


        ## Making API call to get last one year grossProfit=profitPerShare
        if status:
            response = requests.get(iexUrl + '/stock/' + symbol + '/financials?period=annual')
            JSONdata = response.json()

            if 'financials' in JSONdata:
                totalGrossProfit = 0 # to set the null grossProfit later

                # Setting profitPerShare values for transaction days that happened after the grossProfit report date
                for data in JSONdata['financials']:
                    if data['grossProfit'] is None:
                        data['grossProfit'] = 0
                    symbolDF.loc[symbolDF['date'] > data['reportDate'], ['profitPerShare']] = data['grossProfit'] / symbolDF['numberOfShare']
                    totalGrossProfit += data['grossProfit']

                # Setting NaN values in profitPerShare to avarage of last four grossProfit
                symbolDF.loc[pd.isnull(symbolDF['profitPerShare']), ['profitPerShare']] = totalGrossProfit / (len(JSONdata['financials']) * symbolDF['numberOfShare'])
            else:
                status = False
                print('status set to false in grossProfit fetching step for', symbol)

        ## Adding NasdaqIndices for each company in each day of transaction
        # ^IXIC.csv retrieved from https://finance.yahoo.com/quote/%5EIXIC/history?ltr=1
        if status:
            nasdaqIndicesDF = pd.read_csv('^IXIC.csv')
            for index, row in nasdaqIndicesDF.iterrows():
                symbolDF.loc[symbolDF['date'] == row['Date'], ['nasdaqIndex']] = row['Close']

        ## Concatenating the symbolDF to the main dataframe df if there was enough features data
        if status:
            df = pd.concat([symbolDF, df], ignore_index=True, sort=False)
            print(symbolDF.head(3))
            print(len(symbolDF.index), 'rows have been added successfully for', symbol)
            print()
        else:
            print('Sorry, could not add', symbol, 'to the main dataframe!')
            print()

    # keep it quiet for one minute to avoid IES API throttling
#    time.sleep(5)

df.to_csv('StockData.csv')
print('All data in main dataframe written to StockData.csv successfully )-:')
