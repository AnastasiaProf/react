import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';



class StudentPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            students: [],
            toto: []
        };
    }


    componentDidMount(){
        // Static data
        const data = [
            {
            "userID":1,
            "lastName": "Zhou",
            "email": null,
            "photoURL": "http://odinplus.ef.cn/Contact/Photo/16528659",
            "photoUID": null,
            "langCode": "en_US",
            "createdAt": "2017-06-22T19:43:22.270Z",
            "updatedAt": "2017-06-22T19:43:22.270Z"
          },
          {
            "userID":2,
            "lastName": "Chen",
            "email": null,
            "photoURL": "http://odinplus.ef.cn/Contact/Photo/19319576",
            "photoUID": null,
            "langCode": "en_US",
            "createdAt": "2017-06-22T19:43:22.270Z",
            "updatedAt": "2017-06-22T19:43:22.270Z"
          },
          {
            "userID":3,
            "lastName": "Geng",
            "email": null,
            "photoURL": "http://odinplus.ef.cn/Contact/Photo/23641604",
            "photoUID": null,
            "langCode": "en_US",
            "createdAt": "2017-06-22T19:43:22.270Z",
            "updatedAt": "2017-06-22T19:43:22.270Z"
          },
          {
            "userID":4,
            "lastName": "Wang",
            "email": null,
            "photoURL": "http://odinplus.ef.cn/Contact/Photo/23726886",
            "photoUID": null,
            "langCode": "en_US",
            "createdAt": "2017-06-22T19:43:22.270Z",
            "updatedAt": "2017-06-22T19:43:22.270Z"
          }
            ];
            // Update state
            this.setState({students: data});
            
        }




 	render(){

        let students = this.state.students;

        const userID  = this.props.match.params.userID;

        students = students.filter(student => {
            if(student.userID == userID) {
                return true;
            }else{
                return false;
            }    
        }); 

        return (
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
        );
    }
}

export default StudentPage;