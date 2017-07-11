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
import {Grid, Row, Col, Panel, FormControl} from 'react-bootstrap';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import currentWeekNumber from 'current-week-number';
import Moment from 'react-moment';
import AddAnnotation from './AddAnnotation';
import DeleteAnnotation from './DeleteAnnotation';
import getStudentInfo from '../../queries/fetchAnnotations';




class StudentPage extends Component{
    constructor(props){
        super(props);

        this.state = {
            filterAnnot: "",
            all : true,
            modify: []
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
        this.setState({all : false});
        if(e.target.value == "all"){
            this.props.data.refetch({ userID: this.props.match.params.userID });
            this.setState({all : true});
        } else if(e.target.value == "null"){
            this.props.data.refetch({ userID: this.props.match.params.userID, tags: null });
        } else {
            this.props.data.refetch({userID: this.props.match.params.userID, tags: [e.target.value]});
        }
    }

    compareWeek(annotations){
        let today = new Date();
        let currentyear = today.getFullYear();

        let annotsort = [];

        annotations.forEach(function(e){
            let dateparts = e.createdAt.split("T")[0].split("-");
            if(parseInt(dateparts[0]) == parseInt(currentyear)){
                let nicedate = dateparts[1]+'/'+dateparts[2]+'/'+dateparts[0];
                let annotweek = currentWeekNumber(nicedate);
                if(!(annotweek === undefined) && !(e.deleted == true)){
                    if(annotsort[annotweek] === undefined){
                        annotsort[annotweek] = [];
                        annotsort[annotweek]["week_nbr"] = annotweek;
                    }
                    annotsort[annotweek].push(e);
                }
            }
        });
        return annotsort;
    }


    initiateUpdate(event){
        event.preventDefault();

        let current = this.state.modify;
        current.push(event.target.id);
        this.setState({modify: current})
    }

    //modal init
    getInitialState() {
        return { showModal: false };
    }

    close() {
        this.setState({ showModal: false });
    }

    open() {
        this.setState({ showModal: true });
    }


    render(){


        const { student } = this.props.data;

        let back = this.getQueryVariable("oldurl");


        if (!student) { return <div>Loading...</div>}
        let teacherID = this.props.match.params.teacherID;
        let studentID = this.props.match.params.userID;
        let annotations = [];
        console.log(this.state)
        if(this.state.all){
            annotations = this.props.data.annotations.concat().reverse();
        } else {
            annotations = this.props.data.filteredAnnotation.concat().reverse();
        }
        let weeks = this.compareWeek(annotations);
        weeks.sort(function(a, b){
            if(parseInt(a["week_nbr"]) < parseInt(b["week_nbr"])){
                return -1;
            } else if(parseInt(a["week_nbr"]) > parseInt(b["week_nbr"])){
                return 1;
            }
        }).reverse();
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
                                    <option value="all">All Annotations</option>
                                    <option value="null">No Feedback Type</option>
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
                                {weeks.map((week) => {
                                    return(
                                        <div key={week['week_nbr']}>
                                            <h1 className="week-nbr">Week {week['week_nbr']}</h1>
                                            {week.map(annotation => {
                                                if(!(annotation.deleted == true)){
                                                    if(annotation.contentType == "image"){
                                                        return (
                                                            <Panel className="annotation" key={annotation.annotationID}>
                                                                {/*if no tags then do not try to loop over it (Code breakage prevention)*/}
                                                                { !(annotation.tags === null) ?
                                                                    annotation.tags.map(tag => {
                                                                        return(
                                                                            <p key={tag}>{tag}</p>
                                                                        );
                                                                    }) : null
                                                                }
                                                                <img src={annotation.mediaURL} />

                                                                <div>
                                                                    <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
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
                                                                            <p key={tag}>{tag}</p>
                                                                        );
                                                                    }) : null
                                                                }
                                                                <ReactPlayer url={annotation.mediaURL} controls/>

                                                                <div>
                                                                    <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                                                    <p><DeleteAnnotation annotation={annotation} studentID={studentID}/></p>
                                                                </div>
                                                            </Panel>
                                                        );
                                                    }else if(annotation.contentType == "text"){
                                                            return (
                                                                <Panel className="annotation" key={annotation.annotationID}>
                                                                    <a onClick={this.initiateUpdate.bind(this)} id={annotation.annotationID} href="#">Modify</a>
                                                                    { !(annotation.tags === null) ?
                                                                        annotation.tags.map(tag => {
                                                                            return(
                                                                                <p key={tag}>{tag}</p>
                                                                            );
                                                                        }) : <p>No Feedback Type</p>
                                                                    }
                                                                    <p>{annotation.text}</p>

                                                                    <div className="annotation-bottom">
                                                                        <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
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
                                                                            <p key={tag}>{tag}</p>
                                                                        );
                                                                    }) : null
                                                                }
                                                                <ReactAudioPlayer src={annotation.mediaURL} controls />
                                                                <p>{annotation.transcript}</p>

                                                                <div className="annotation-bottom">
                                                                    <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                                                    <p><DeleteAnnotation annotation={annotation} studentID={studentID}/></p>
                                                                </div>
                                                            </Panel>
                                                        );
                                                    }
                                                }
                                            })}
                                        </div>
                                    )
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
