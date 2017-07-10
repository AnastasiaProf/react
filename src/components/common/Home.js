/**
 * Home Component
 * Composed of the course filter & the sort dropdown for the student list
 * Child : StudentHomeList
 */

import React, {Component} from 'react';
import {Row, Tab, Nav, Col, NavItem} from 'react-bootstrap';
import WeeklyCourses from '../courses/WeeklyCourses'
import AllCourses from '../courses/AllCourses'






class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            list: {},
            filterStud: ""
        };
    }



    render(){
        let teacherID = this.props.match.params.teacherID;


        return(
            <div>
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                    <Row className="clearfix">
                        <Col sm={12}>
                            <Nav bsStyle="pills">
                                <NavItem eventKey="first">
                                    This Week
                                </NavItem>
                                <NavItem eventKey="second">
                                    All Classes
                                </NavItem>
                            </Nav>
                        </Col>

                        <Col sm={12}>
                            <Tab.Content animation>
                                <Tab.Pane eventKey="first">
                                    <WeeklyCourses teacherID={teacherID} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="second">
                                    <AllCourses teacherID={teacherID} />
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>

        );
    }
}

export default Home;