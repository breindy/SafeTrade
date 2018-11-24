# SafeTrade
> SafeTrade aims to automate tips/hints production for investors to invest safe without doing manual analysis. This is an attempt to predict on stock prices by doing analysis on market data using machine learning tools and principles.

### Project Structure

- `FrontendSafeTrade`
    + @Michelle: add some description here, please!

- `BackendSafeTrade`
    + This is a RESTFUL server. The frontend makes api calls to BackendSafeTrade to get data. BackendSafeTrade in turn collects and customize required data by making api calls to IEX as well as to local PostgreSQL server.

- `PredictionModel`
    + This is where the model for stock prediction is developed. Initially, we are using python to extract and clean data as well as train model on that data. We stil have to integrate this part to the backend. 

