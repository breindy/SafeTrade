import React, { Component } from 'react'
import { FormControl, Button } from 'react-bootstrap'
import { BrowserRouter as Router, Redirect } from 'react-router-dom'
import './Login.css'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      error: {},
      isLoggedIn: false
    }
    this.onChange = this.onChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  onSubmit(e) {
    e.preventDefault()

    const existingUser = {
      email: this.state.username,
      password: this.state.password
    }

    console.log(existingUser)

    // const loginCheckUrl = 'http://localhost:8000/api/auth/login';
    // const response = await fetch(loginCheckUrl);
    // const data = await response.json();

    // return data;

    fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(existingUser),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
      .then(res => {
        res.json()
      })
      .then(json => this.setState({ isLoggedIn: true }))
      .catch(error => {
        console.error(error)
      })
    // this.loginCheck('http://localhost:8000/api/auth/login').then(console.log)
  }

  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to="/dashboard" />
    }
    return (
      <div>
        <div class="whole-login-container">
          <h3 class="text-center">Login</h3>
          <form class="login-form" onSubmit={this.onSubmit}>
            <h4>Username</h4>
            <FormControl
              id="formControlsText"
              type="text"
              label="Text"
              name="username"
              value={this.state.username}
              onChange={this.onChange}
            />
            <br />
            <br />
            <h4>Password</h4>
            <FormControl
              id="formControlsPassword"
              label="Password"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
            />
            <br />
          </form>
        </div>
      </div>
    )
  }
}

export default Login
