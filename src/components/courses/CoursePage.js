import React, {Component} from 'react';
import { Link, IndexRoute} from 'react-router-dom';
import { graphql } from 'react-apollo';
import {Grid, Row, Col, FormControl, Glyphicon} from 'react-bootstrap';
import currentWeekNumber from 'current-week-number';


import AddAnnotation from './AddClassAnnotation';
import CourseAnnotations from './CourseAnnotations';
import getAnnotations from '../../queries/fetchClassAnnotations';




class CoursePage extends Component{
    constructor(props){
        super(props);

        this.state = {
            filterAnnot: "",
            all : true
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

    getOnlyClassAnnot(annotations) {
        let returnarray = [];
        annotations.forEach(function(e){
            if(!(e.students === null)){
                if(e.students.length === 0){
                    if(!(e.course === null)){
                        if(e.course.courseID === this.props.match.params.courseID){
                            returnarray.push(e)
                        }
                    }
                }
            }
        }, this);
        return returnarray
    }

//onChange of the filter dropdown refetch graphql query
    filterAnnot(e){
        this.setState({all : false});
        if(e.target.value == "all"){
            this.props.data.refetch({ courseID: this.props.match.params.courseID });
            this.setState({all : true});
        } else if(e.target.value == "null"){
            this.props.data.refetch({ courseID: this.props.match.params.courseID, tags: null });
            this.setState({filterTags: null})
        } else {
            this.props.data.refetch({courseID: this.props.match.params.courseID, tags: [e.target.value]});
            this.setState({filterTags: [e.target.value]})
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

    render(){
        console.log(this)
        const { course } = this.props.data;

        let back = this.getQueryVariable("oldurl");


        if (!course) { return <div>Loading...</div>}
        let teacherID = this.props.match.params.teacherID;
        let courseID = this.props.match.params.courseID;
        let annotations = [];

        if(this.state.all){
            annotations = this.getOnlyClassAnnot(this.props.data.annotations);
            annotations = annotations.concat().reverse();
        } else {
            annotations = this.getOnlyClassAnnot(this.props.data.filteredAnnotation);
            annotations = annotations.concat().reverse();
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
                <div key={course.courseID}>
                    <Grid>
                        <Row>
                            <Col xs={12} md={8} mdOffset={2} >
                                <div>
                                    {
                                        this.getQueryVariable("oldurl")
                                    }
                                </div>

                                <h1 className="student-name">{course.description}</h1>
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

                                <AddAnnotation courseID={courseID} teacherID={teacherID}/>
                                {weeks.map((week) => {
                                    return(
                                        <div key={week['week_nbr']}>
                                            <h1 className="week-nbr">Week {week['week_nbr']}</h1>
                                            <CourseAnnotations week={week} annotations={this.props.data.annotations} courseID={courseID} />
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

export default graphql(getAnnotations, { options:  (props) => { return { variables: { courseID: props.match.params.courseID} } } },)(CoursePage);





