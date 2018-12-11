import React, { Component } from 'react'
import { FormControl, Button } from 'react-bootstrap'
import { BrowserRouter as Router } from 'react-router-dom'
import './Signup.css'
import axios from 'axios'

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      password2: '',
      error: {}
    }
    // this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange = e => this.setState({ [e.target.name]: e.target.value })

  onSubmit(e) {
    e.preventDefault()

    const newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    }

    console.log(newUser)

    fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(newUser),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        // return res.json()
        console.log(res.data)
      })
      .then(resJson => {
        console.log(resJson)
      })
      .catch(err => console.log(err.response.data))

    // axios
    //   .post('localhost:8000/api/auth/signup', newUser)
    //   .then(res => console.log(res.data))
    //   .catch(err => console.log(err.response.data))
  }

  render() {
    return (
      <Router>
        <div class="whole-signup-container">
          <h3 class="text-center">Sign up</h3>
          <form class="signup-form" onSubmit={this.onSubmit}>
            <h4>First Name</h4>
            <FormControl
              id="formControlsText"
              type="text"
              label="Text"
              name="firstName"
              value={this.state.firstName}
              onChange={this.onChange.bind(this)}
            />
            <br />
            <h4>Last Name</h4>
            <FormControl
              id="formControlsText"
              type="text"
              label="Text"
              name="lastName"
              value={this.state.lastName}
              onChange={this.onChange.bind(this)}
            />
            <br />
            <h4>Username</h4>
            <FormControl
              id="formControlsText"
              type="text"
              label="Text"
              name="username"
              value={this.state.username}
              onChange={this.onChange.bind(this)}
            />
            <br />
            <h4>Email</h4>
            <FormControl
              id="formControlsEmail"
              type="email"
              label="Email address"
              name="email"
              value={this.state.email}
              onChange={this.onChange.bind(this)}
            />
            <br />
            <h4>Password</h4>
            <FormControl
              id="formControlsPassword"
              label="Password"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.onChange.bind(this)}
            />
            <br />

            <Button type="submit" bsStyle="btn">
              Sign me up!
            </Button>
          </form>
        </div>
      </Router>
    )
  }
}

export default Signup
