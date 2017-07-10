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
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import MultiSelect from 'react-selectize';

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
                    return (<Link className="btn back" to={`/${this.props.match.params.teacherID}/${this.props.match.params.courseID}`}> <Glyphicon glyph="chevron-left" /> Back to class</Link>);
                } else if(pair[1] == "studentslist") {
                    return (<Link className="btn back" to={`/${this.props.match.params.teacherID}/students`}><Glyphicon glyph="chevron-left" /> Back to class </Link>);
                }
            }
        }
        return null;
    }

    //onChange of the filter dropdown refetch graphql query
    filterAnnot(e){
        if(e.target.value == ""){
            this.props.data.refetch({ userID: this.props.match.params.userID, tags: ["No Feedback type", "Strength", "Weakness", "Action Plan", "Parent Update", "", null] })
        } else {
            this.props.data.refetch({userID: this.props.match.params.userID, tags: [e.target.value]})
        }
    }

    //getInitialState :: a -> UIState
    // getInitialState(){
    //     return {tags: [this.props.data.annotations.tags].map(function(tag){
    //         return {label: tag, value: tag};
    //     })};
    // }

    //modal init
    getInitialState() {
        return { showModal: false };
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        console.log(this);
        this.setState({ showModal: true });
    }


    render(){

        var self = this;

       

        const { student } = this.props.data;

        let back = this.getQueryVariable("oldurl");


        if (!student) { return <div>Loading...</div>}
        let teacherID = this.props.match.params.teacherID;
        let studentID = this.props.match.params.userID;
        let annotations = this.props.data.annotations.concat().reverse();

        return (
            <div>
                <div key={student.userID}>
                    <Grid>
                        <Row>
                            <Col xs={6} md={8} mdOffset={2} >
                                <div>
                                    {
                                        this.getQueryVariable("oldurl")
                                    }
                                </div>
                                <img onClick={this.open.bind(this)} className="student-picture" src={student.photoURL} alt="242x200"/>
                                <Modal  bsSize="small" show={this.state.showModal} onHide={this.close.bind(this)}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>{student.firstName} {student.lastName}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <img className="img-modal" src={student.photoURL} />
                                    </Modal.Body>
                                </Modal>

                                <h1 className="student-name">{student.firstName} {student.lastName}</h1>
                                <FormControl className="tag-filter" onChange={this.filterAnnot.bind(this)} componentClass="select" placeholder="select">
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

                                <AddAnnotation studentID={studentID} teacherID={teacherID}/>

                                {annotations.map(annotation => {
                                    if(!(annotation.deleted == true)){
                                        if(annotation.contentType == "image"){
                                            return (
                                                <Panel className="annotation" key={annotation.annotationID}>
                                                   
                                                    {/*if no tags then do not try to loop over it (Code breakage prevention)*/}
                                                    { !(annotation.tags === null) ?
                                                        annotation.tags.map(tag => {
                                                            return(
                                                                <div key={tag}>
                                                                <p key={tag}>{tag}</p>
                                                                </div>
                                                            );
                                                        }) : null
                                                    }
                                                    <img src={annotation.mediaURL} />

                                                    <div>
                                                        <p className="date">{annotation.createdAt}</p>
                                                        <DeleteAnnotation annotation={annotation} studentID={studentID}/>
                                                    </div>
                                                </Panel>
                                            );
                                        }else if(annotation.contentType == "video"){
                                            return (
                                                <Panel className="annotation" key={annotation.annotationID}>
                                                    { !(annotation.tags === null) ?
                                                        annotation.tags.map(tag => {
                                                            return(
                                                                <div key={tag}>
                                                                <p key={tag}>{tag}</p>
                                                                </div>
                                                            );
                                                        }) : null
                                                    }
                                                    <ReactPlayer url={annotation.mediaURL} controls/>

                                                    <div>
                                                        <p className="date">{annotation.createdAt}</p>
                                                        <p><DeleteAnnotation annotation={annotation} studentID={studentID}/></p>
                                                    </div>
                                                </Panel>
                                            );
                                        }else if(annotation.contentType == "text"){
                                            return (
                                                <Panel className="annotation" key={annotation.annotationID}>
                                                     { !(annotation.tags === null) ?
                                                        annotation.tags.map(tag => {
                                                            return(
                                                                <div key={tag}>
                                                               
                                                                <p key={tag}>{tag}</p>
                                                                </div>  
                                                            );
                                                        }) : null
                                                    }
                                                    <p>{annotation.text}</p>

                                                    <div className="annotation-bottom">
                                                        <p className="date">{annotation.createdAt}</p>
                                                        <p><DeleteAnnotation annotation={annotation} studentID={studentID}/></p>
                                                    </div>
                                                </Panel>
                                            );
                                        }else if(annotation.contentType == "audio"){
                                            return (
                                                <Panel className="annotation" key={annotation.annotationID}>
                                                    { !(annotation.tags === null) ?
                                                        annotation.tags.map(tag => {
                                                            return(
                                                                <div key={tag}>
                                                                <p key={tag}>{tag}</p>
                                                                </div>
                                                            );
                                                        }) : null
                                                    }
                                                    <ReactAudioPlayer src={annotation.mediaURL} controls />
                                                    <p>{annotation.transcript}</p>

                                                    <div className="annotation-bottom">
                                                        <p className="date">{annotation.createdAt}</p>
                                                        <p><DeleteAnnotation annotation={annotation} studentID={studentID}/></p>
                                                    </div>
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
