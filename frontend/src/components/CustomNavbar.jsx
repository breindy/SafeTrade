import React, { Component } from 'react'
import { Navbar, Nav, NavItem, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import './CustomNavbar.css'
class CustomNavbar extends Component {
  render() {
    return (
      <Navbar default collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to="/">
              <Image src="assets/logo.png" className="navbar-image" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={1} componentClass={Link} href="/" to="/">
              Home
            </NavItem>
            <NavItem
              eventKey={2}
              componentClass={Link}
              href="/signup"
              to="/signup"
            >
              Signup
            </NavItem>
            <NavItem
              eventKey={2}
              componentClass={Link}
              href="/login"
              to="/login"
            >
              Login
            </NavItem>
            <NavItem
              eventKey={2}
              componentClass={Link}
              href="/search"
              to="/search"
            >
              Search
            </NavItem>
            <NavItem
              eventKey={2}
              componentClass={Link}
              href="/dashboard"
              to="/dashboard"
            >
              Dashboard
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

export default CustomNavbar
