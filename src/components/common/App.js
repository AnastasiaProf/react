/**
 * Page layout, reused through the whole application
 * In .content it calls the child associated to the route
 */


import React, { Component } from 'react';
import '../../App.css';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { Link } from 'react-router-dom';
import logo from '../../blacklogo.png';

class App extends Component {
    render() {
        //get teacherID from URL
        var teacherID = window.location.pathname.split("/")[1];
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
                                <li><Link to={`/logout`}>Logout</Link></li>
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
