# Backend Starting instruction
> Built from [here](https://github.com/CUNYTechPrep/backend-starter)  

$ npm install  
$ npm install bcrypt-nodejs passport passport-local cookie-parser express-session  
$ npm services start postgres  
$ npm run  

## Explanations

- `/config/config.json`
    + This file contains the credentials for connecting to the postgres database. Make sure these details match the DB setup.  

## Running PostgreSQL
> If not running already  

To run $ brew services start postgresql  
To stop $ brew services stop postgresql  

## Use Cases:
- 'baseURL/stock?ticker=tickerSymbol' will return the current stock price of a single company. Stock price of the tickerSymbol company will be returned. For example, baseURL/stock?ticker=AAPL will return Apple Inc.'s price in a format like {"price":"176.78"}  
