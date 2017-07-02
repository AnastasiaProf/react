import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';

import AddAnnotation from './AddAnnotation';
import getStudentInfo from '../../queries/fetchAnnotations';



class StudentPageTest extends Component{

    render(){

        console.log(this);

        const { student } = this.props.data;
        const title = (<h3>Annotation</h3>);

        if (!student) { return <div>Loading...</div>}
        console.log(this.props.data.annotations.annotationID);
        let teacherID = this.props.match.params.teacherID;
        let studentID = this.props.match.params.userID;
        let annotations = this.props.data.annotations.concat().reverse();

        return (
            <div>
                <Link to="/">Back</Link>

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
                            <Col xs={12} md={8} mdOffset={2}>
                                <h1>All the feedback posts</h1>
                                <AddAnnotation studentID={studentID} teacherID={teacherID}/>

                                {annotations.map(annotation => {
                                    if(annotation.contentType == "image"){
                                        return (
                                            <Panel header={title} key={annotation.annotationID}>
                                                <p>{annotation.contentType}</p>
                                                <img src={annotation.mediaURL} />
                                            </Panel>
                                        );
                                    }else if(annotation.contentType == "video"){
                                        return (
                                            <Panel header={title} key={annotation.annotationID}>
                                                <p>{annotation.contentType}</p>
                                                <video><source src={annotation.mediaURL} type="video/mp4"/></video>
                                            </Panel>
                                        );
                                    }else if(annotation.contentType == "text"){
                                        return (
                                            <Panel header={title} key={annotation.annotationID}>
                                                <p>{annotation.contentType}</p>
                                                <p>{annotation.text}</p>
                                            </Panel>
                                        );
                                    }else if(annotation.contentType == "audio"){
                                        return (
                                            <Panel header={title} key={annotation.annotationID}>
                                                <p>{annotation.contentType}</p>
                                                <p>{annotation.transcript}</p>
                                                <audio src={annotation.mediaURL}></audio>
                                            </Panel>
                                        );
                                    }
                                })}
                            </Col>
                        </Row>
                    </Grid>
                </div>
            </div>
        );
    }
}


export default graphql(getStudentInfo, { options:  (props) => { return { variables: { userID: props.match.params.userID} } } },)(StudentPageTest);
