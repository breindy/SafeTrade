import React, { Component } from 'react'
import { FormControl, Button } from 'react-bootstrap'
import { BrowserRouter as Router } from 'react-router-dom'
import './Signup.css'

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      requestFailed: false
    }
  }

  componentDidMount() {
    this.getData()
  }

  componentWillMount() {}

  getData = () => {
    fetch('/api/auth/whoAmI')
      .then(response => {
        console.log(response)
        if (!response.ok) {
          throw Error('Something wrong with getting user data')
        }
        return response
      })
      .then(response => response.json())
      .then(
        response => {
          this.setState({
            userData: response
          })
        },
        () => {
          this.setState({
            requestFailed: true
          })
        }
      )
  }

  state = {}
  render() {
    if (this.state.requestFailed) {
      return (
        <div>
          <h3 className="text-center">Dashboard</h3>
          <p className="text-center">You must to login to see this page.</p>
        </div>
      )
    }
    if (!this.state.userData) {
      return (
        <div>
          <h3 className="text-center">Dashboard</h3>
          <p className="text-center">Loading...</p>
        </div>
      )
    }
    return (
      <Router>
        <div>
          <h3 className="text-center">Dashboard</h3>
          <p className="text-center">
            First Name: {this.state.userData.firstName}
          </p>

          <p className="text-center">
            Last Name: {this.state.userData.lastName}
          </p>
          <p className="text-center">Email: {this.state.userData.email}</p>
        </div>
      </Router>
    )
  }
}

export default Dashboard
