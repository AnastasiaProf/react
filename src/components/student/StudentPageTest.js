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
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';

import AddAnnotation from './AddAnnotation';
import DeleteAnnotation from './DeleteAnnotation';
import getStudentInfo from '../../queries/fetchAnnotations';




class StudentPageTest extends Component{

    getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                if(pair[1] == "home"){
                    return (<Link className="btn btn-default" to={`/${this.props.match.params.teacherID}`}>Back</Link>);
                } else if(pair[1] == "studentslist") {
                    return (<Link className="btn btn-default" to={`/${this.props.match.params.teacherID}/students`}>Back</Link>);
                }
            }
        }
        return null;
    }

    render(){

        const { student } = this.props.data;
        const title = (<h3>Annotation</h3>);


        let back = this.getQueryVariable("oldurl");


        if (!student) { return <div>Loading...</div>}
        console.log(this.props.data.annotations.annotationID);
        let teacherID = this.props.match.params.teacherID;
        let studentID = this.props.match.params.userID;
        let annotations = this.props.data.annotations.concat().reverse();

        return (
            <div>
                {
                    this.getQueryVariable("oldurl")
                }
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
                                                <p><DeleteAnnotation/></p>
                                            </Panel>
                                        );
                                    }else if(annotation.contentType == "video"){
                                        return (
                                            <Panel header={title} key={annotation.annotationID}>
                                                <p>{annotation.contentType}</p>
                                                <ReactPlayer url={annotation.mediaURL} controls/>
                                                <p><DeleteAnnotation/></p>
                                            </Panel>
                                        );
                                    }else if(annotation.contentType == "text"){
                                        return (
                                            <Panel header={title} key={annotation.annotationID}>
                                                <p>{annotation.contentType}</p>
                                                <p>{annotation.text}</p>
                                                <p><DeleteAnnotation/></p>
                                            </Panel>
                                        );
                                    }else if(annotation.contentType == "audio"){
                                        return (
                                            <Panel header={title} key={annotation.annotationID}>
                                                <p>{annotation.contentType}</p>
                                                <ReactAudioPlayer src={annotation.mediaURL} controls />
                                                <p>{annotation.transcript}</p>
                                                <p><DeleteAnnotation/></p>
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
