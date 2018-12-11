import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Grid, Row, Col, Image, Button } from 'react-bootstrap'
import './Home.css'

class Home extends Component {
  state = {}
  render() {
    return (
      <div>
        <div className="landing-section">
          <Col md={6}>
            <h2 className="heading-header">SafeTrade</h2>
            <p className="heading-paragraph">
              Smart Investing Made Simple.
              <br />
              <br />
              Accessible and Easy-to-use modern style stock trading right at
              your fingertips.
            </p>
            <Link to="/signup">
              <Button bsStyle="btn">Get Started Now</Button>
            </Link>
          </Col>
          <Image src="assets/trade.png" className="landing-image" />
          <Col md={6} />
        </div>

        <Grid className="about-section">
          <h3 className="text-center about-heading">About</h3>
          <Row className="show-grid text-center" id="about">
            <Col xs={12} sm={6} md={6} className="person-wrapper">
              <Image src="assets/person-1.jpg" circle className="profile-pic" />
              <h3>Shofiqur</h3>
              <p>Hello World Hello World Hello World Hello World.</p>
            </Col>

            <Col xs={12} sm={6} md={6} className="person-wrapper">
              <Image src="assets/person-2.jpg" circle className="profile-pic" />
              <h3>Michelle</h3>
              <p>Lorem Lorem Lorem Lorem Lorem Lorem Lorem.</p>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Home
