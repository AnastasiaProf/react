/**
 * Student Page Component
 * Composed of the course filter & the sort dropdown for the student list
 * Child : AddAnnotation, DeleteAnnotation
 * TODO Update Annotation
 * TODO Improve tags filtering system
 */

import React, {Component} from 'react';
import { Link, IndexRoute} from 'react-router-dom';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import FormControl from 'react-bootstrap/lib/FormControl';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';

import AddAnnotation from './AddAnnotation';
import DeleteAnnotation from './DeleteAnnotation';
import getStudentInfo from '../../queries/fetchAnnotations';




class StudentPage extends Component{
    constructor(props){
        super(props);

        this.state = {
            filterAnnot: ""
        }
    }


    //Function to get url parameter to manage the back button link
    getQueryVariable(variable, value = false) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                if(pair[1] == "home"){
                    return (<Link className="btn btn-default" to={`/${this.props.match.params.teacherID}/${this.props.match.params.courseID}`}>Back</Link>);
                } else if(pair[1] == "studentslist") {
                    return (<Link className="btn btn-default" to={`/${this.props.match.params.teacherID}/students`}>Back</Link>);
                }
            }
        }
        return null;
    }

    //onChange of the filter dropdown refetch graphql query
    filterAnnot(e){
        if(e.target.value == ""){
            this.props.data.refetch({ userID: this.props.match.params.userID, tags: ["No Feedback type", "Strength", "Weakness", "Action Plan", "Parent Update"] })
        } else {
            this.props.data.refetch({userID: this.props.match.params.userID, tags: [e.target.value]})
        }
    }


    render(){

        const { student } = this.props.data;
        const title = (<h3>Annotation</h3>);

        let back = this.getQueryVariable("oldurl");


        if (!student) { return <div>Loading...</div>}
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
                                <h1>{student.firstName} {student.lastName}</h1>
                                <FormControl onChange={this.filterAnnot.bind(this)} componentClass="select" placeholder="select">
                                    <option value="">No Filter</option>
                                    <option value="Strength">Strengths</option>
                                    <option value="Weakness">Weaknesses</option>
                                    <option value="Action Plan">Action plan</option>
                                    <option value="Parent Update">Parent update</option>
                                </FormControl>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={8} mdOffset={2}>
                                <h1>All the feedback posts</h1>
                                <AddAnnotation studentID={studentID} teacherID={teacherID}/>

                                {annotations.map(annotation => {
                                    if(!(annotation.deleted == true)){
                                        if(annotation.contentType == "image"){
                                            return (
                                                <Panel header={title} key={annotation.annotationID}>
                                                    <p>{annotation.contentType}</p>
                                                    <img src={annotation.mediaURL} />
                                                    {/*if no tags then do not try to loop over it (Code breakage prevention)*/}
                                                    { !(annotation.tags === null) ?
                                                        annotation.tags.map(tag => {
                                                            return(
                                                                <p key={tag}>{tag}</p>
                                                            );
                                                        }) : null
                                                    }
                                                    <p><DeleteAnnotation annotation={annotation} studentID={studentID}/></p>
                                                </Panel>
                                            );
                                        }else if(annotation.contentType == "video"){
                                            return (
                                                <Panel header={title} key={annotation.annotationID}>
                                                    <p>{annotation.contentType}</p>
                                                    <ReactPlayer url={annotation.mediaURL} controls/>
                                                    { !(annotation.tags === null) ?
                                                        annotation.tags.map(tag => {
                                                            return(
                                                                <p key={tag}>{tag}</p>
                                                            );
                                                        }) : null
                                                    }
                                                    <p><DeleteAnnotation annotation={annotation} studentID={studentID}/></p>
                                                </Panel>
                                            );
                                        }else if(annotation.contentType == "text"){
                                            return (
                                                <Panel header={title} key={annotation.annotationID}>
                                                    <p>{annotation.contentType}</p>
                                                    <p>{annotation.text}</p>
                                                    { !(annotation.tags === null) ?
                                                        annotation.tags.map(tag => {
                                                            return(
                                                                <p key={tag}>{tag}</p>
                                                            );
                                                        }) : null
                                                    }
                                                    <p><DeleteAnnotation annotation={annotation} studentID={studentID}/></p>
                                                </Panel>
                                            );
                                        }else if(annotation.contentType == "audio"){
                                            return (
                                                <Panel header={title} key={annotation.annotationID}>
                                                    <p>{annotation.contentType}</p>
                                                    <ReactAudioPlayer src={annotation.mediaURL} controls />
                                                    <p>{annotation.transcript}</p>
                                                    { !(annotation.tags === null) ?
                                                        annotation.tags.map(tag => {
                                                            return(
                                                                <p key={tag}>{tag}</p>
                                                            );
                                                        }) : null
                                                    }
                                                    <p><DeleteAnnotation annotation={annotation} studentID={studentID}/></p>
                                                </Panel>
                                            );
                                        }
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

export default graphql(getStudentInfo, { options:  (props) => { return { variables: { userID: props.match.params.userID} } } },)(StudentPage);
