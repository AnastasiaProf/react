import React, { Component } from 'react';
import '../../App.css';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { Link } from 'react-router-dom';
import logo from '../../blacklogo.png';

import Home from './Home';

class App extends Component {
  render() {
    var teacherID = window.location.pathname.split("/")[1];
    console.log(window.location.pathname)
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} md={12}>
              <ul className="header">
                <li> <img src={logo} className="EF-logo" alt="EF logo" /> </li>
                <li><Link to={`/${teacherID}`}>Home</Link></li>
                <li><Link to={`/${teacherID}/students`}>Students</Link></li>
                <li><Link to={`/${teacherID}/configuration`}>Settings</Link></li>
              </ul>
            </Col>
          </Row>
        </Grid>
        <div className="content">
          {this.props.children}
        </div>
      </div>

    );
  }
}

export default App;
