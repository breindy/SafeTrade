import React, { Component } from 'react'
import { Button } from 'react-bootstrap'
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
        <h3 className="text-center">Search</h3>

        <div className="search-container">
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              placeholder="Enter Stock Symbol..."
              value={this.state.searchValue}
              name="searchValue"
              onChange={this.onChange}
            />
          </form>
        </div>

        <div className="search-results">
          <br />
          <h3 className="text-center" id="priceCompany">
            Price
          </h3>
          <p id="stockPrice" className="text-center" />
        </div>
      </div>
    )
  }
}

export default Search
