/**
 * Student Page Component
 * Composed of the course filter & the sort dropdown for the student list
 * Child : AddStudentAnnotation
 */

import React, {Component} from 'react';
import { Link, IndexRoute} from 'react-router-dom';
import { graphql } from 'react-apollo';
import {Grid, Row, Col, FormControl, Glyphicon, Modal} from 'react-bootstrap';

import currentWeekNumber from 'current-week-number';

import AddStudentAnnotation from './AddStudentAnnotation';
import StudentAnnotations from './StudentsAnnotations';
import getStudentInfo from '../../queries/fetchAnnotations';




class StudentPage extends Component{
    constructor(props){
        super(props);

        this.state = {
            filterAnnot: "",
            all : true,
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
                    return (<Link className="btn back" to={`/${this.props.match.params.courseID}`}> <Glyphicon glyph="chevron-left" /> Back to class</Link>);
                } else if(pair[1] == "studentslist") {
                    return (<Link className="btn back" to={`/students`}><Glyphicon glyph="chevron-left" /> Back to class </Link>);
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
            this.setState({all : true, filterTags: null});
        } else if(e.target.value == "null"){
            this.props.data.refetch({ userID: this.props.match.params.userID});
            this.setState({filterTags: "no", all : true})
        } else {
            this.props.data.refetch({userID: this.props.match.params.userID, tags: [e.target.value]});
            this.setState({filterTags: [e.target.value]})
        }
    }

    //Function to sort all annotation bby week nummber
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


    //Close modal
    close() {
        this.setState({ showModal: false });
    }

    //Open modal on picture click
    open() {
        this.setState({ showModal: true });
    }


    render(){
        console.log(this)
        const { student } = this.props.data;

        let back = this.getQueryVariable("oldurl");


        if (!student) { return <div>Loading...</div>}
        let teacherID = localStorage.getItem('userID');
        let studentID = this.props.match.params.userID;
        let annotations = [];

        //If not filter take the whole annotations array loaded
        if(this.state.all){
            annotations = this.props.data.annotations.concat().reverse();
            if(this.state.filterTags == "no"){
                annotations.forEach(function(e, i){
                    if(e.tags.length > 0){
                        annotations.splice(i, 1);
                    }
                })
            }
        } else {
            annotations = this.props.data.filteredAnnotation.concat().reverse();
        }

        //Group annotations by week after filtering
        let weeks = this.compareWeek(annotations);

        //Sort week to see the recent one first
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
                            <Col xs={12} md={8} mdOffset={2} >
                                <div></div>
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
                                    <option value="Strengths">Strengths</option>
                                    <option value="Weaknesses">Weaknesses</option>
                                    <option value="Action Plan">Action plan</option>
                                    <option value="Parent update">Parent update</option>
                                </FormControl>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={8} mdOffset={2}>

                                <AddStudentAnnotation studentID={studentID} teacherID={teacherID} courseID={this.props.match.params.courseID}/>
                                {weeks.map((week) => {
                                    return(
                                        <div key={week['week_nbr']}>
                                            <h1 className="week-nbr">Week {week['week_nbr']}</h1>
                                            <StudentAnnotations week={week} annotations={this.props.data.annotations} courseID={this.props.match.params.courseID} studentID={studentID} />
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



export default graphql(getStudentInfo, { options:  (props) => { return { variables: { userID: props.match.params.userID } } } },)(StudentPage);
