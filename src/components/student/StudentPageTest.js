import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';


        const getStudentInfo = gql`
        query getStudentInfo($userID: ID!)
        {
            student(studentID: $userID) {
                firstName
                photoURL
            }
            annotations(filterStudentIDs: [$userID]) {
                annotationID
            }
        }
        `;


class StudentPageTest extends Component{
    constructor(props) {
    super(props);
    this.state= {
        filter: null, 
        students: []
    };
}

 	render(){
        console.log(this);

        let students  = this.props.data.students;
        var userID  = this.props.match.params.userID;
        return(null)
/*        students = students.filter(student => {
            if(student.userID == userID) {
                return true;
            }else{
                return false;
            }    
        }); */

/*        return (
        	<div>
        		<Link to="/">Back</Link>
                
                {students.map(student => {
                    return(
                        <div key={student.userID}>
                            <Grid>
                                <Row>
                                    <Col xs={6} md={2} mdOffset={4} >
                                        <img src={student.photoURL} alt="242x200"/>
                                    </Col>
                                    <Col xs={6} md={4} >
                                        <h1>{student.lastName}</h1>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={6} md={4} xsOffset={6} mdOffset={4}>
                                        <h1>All the feedback posts</h1>
                                    </Col>
                                </Row>
                            </Grid>
                        </div>
                    );
                })}
                
                
        	</div>
        );*/
    }
}


export default graphql(getStudentInfo, { options:  (props) => { return { variables: { userID: props.match.params.userID} } } },)(StudentPageTest);
