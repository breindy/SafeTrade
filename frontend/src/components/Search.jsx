import React, { Component } from 'react'
import { Button, FormControl, Grid, Row, Col } from 'react-bootstrap'
import './Search.css'

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      requestFailed: false,
      searchValue: ''
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()
    console.log(this.state.searchValue)
    fetch('/api/stock/?ticker=' + this.state.searchValue)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        document.getElementById('stockPrice').innerHTML = response.price
        this.setState({
          stockPrice: response
        })
      })
      .catch(error => {
        console.error(error)
      })

    fetch('/api/stock/?ticker=' + this.state.searchValue)
      .then(response => response.json())
      .then(response => {
        console.log(response)
        document.getElementById('stockPrice').innerHTML = response.price
        this.setState({
          stockPrice: response
        })
      })
      .catch(error => {
        console.error(error)
      })
  }

  render() {
    return (
      <div>
        <Grid>
          <Row className="show-grid">
            <Col xs={12} md={8}>
              <div className="search-row">
                <div class="whole-login-container">
                  <h3 class="text-center">Search</h3>
                  <form onSubmit={this.onSubmit}>
                    <h4>Enter Stock Symbol</h4>
                    <FormControl
                      id="formControlsText"
                      type="text"
                      placeholder="ex. AAPL, GOOGL, FB..."
                      value={this.state.searchValue}
                      name="searchValue"
                      onChange={this.onChange}
                    />
                    <br />
                    <div className="search-results">
                      <h4 className="text-center" id="priceCompany">
                        Price
                      </h4>
                      <p id="stockPrice" className="text-center" />
                      <br />
                    </div>
                  </form>
                </div>
              </div>
            </Col>

            <Col xs={6} md={4}>
              <div className="search-row">
                <div class="whole-login-container">
                  <h3 class="text-center">Wallet</h3>
                  <div>
                    <h6>My Stocks</h6>
                    <p>AAPL: 1</p>
                    <p>AAPL: 1</p>
                    <p>AAPL: 1</p>
                    <Row>
                      <Col md={6} xs={6}>
                        <Button type="submit" bsStyle="btn">
                          Buy
                        </Button>
                      </Col>
                      <Col md={6} xs={6}>
                        <Button type="submit" bsStyle="btn">
                          Sell
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Search
