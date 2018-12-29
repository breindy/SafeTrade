import React, { Component } from 'react'
import './App.css'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Navbar from './components/CustomNavbar'
import Search from './components/Search'
import "circular-std";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Route exact path="/" component={Home} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/search" component={Search} />
        </div>
      </Router>
    )
  }
}

export default App
