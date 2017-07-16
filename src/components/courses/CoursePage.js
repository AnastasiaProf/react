import React, {Component} from 'react';
import { Link, IndexRoute} from 'react-router-dom';
import { graphql } from 'react-apollo';
import {Grid, Row, Col, Panel, FormControl, Button, Glyphicon, FormGroup, Checkbox} from 'react-bootstrap';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import currentWeekNumber from 'current-week-number';

import gql from 'graphql-tag';
import { compose } from 'react-apollo';

import Moment from 'react-moment';
import AddAnnotation from './AddClassAnnotation';
import DeleteAnnotation from './DeleteClassAnnotation';
import getAnnotations from '../../queries/fetchClassAnnotations';




class CoursePage extends Component{
    constructor(props){
        super(props);

        this.state = {
            filterAnnot: "",
            all : true,
            modify: [],
            checkboxes: []
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

    initiateUpdate(event){
        event.preventDefault();

        let current = this.state.modify;
        current.push(event.target.id);

        let currentcheckboxes = this.state.checkboxes;
        currentcheckboxes[event.target.id] = [];

        let result = this.props.data.annotations.filter(function( obj ) {
            return obj.annotationID == event.target.id;
        })[0];

        if(!(result.tags === null)){
            result.tags.forEach(function(e){
                currentcheckboxes[event.target.id].push(e)
            });
        }


        this.setState({modify: current, checkboxes: currentcheckboxes})
    }

    preChecking(annot){

        let str = "Strength_"+annot;
        let wk = "Weakness_"+annot;
        let ap = "Action Plan_"+annot;
        let pu = "Parent Update_"+annot;

        let str_checcked = <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={str} inline>Strengths</Checkbox >;
        let wk_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={wk} inline>Weaknesses</Checkbox>;
        let ap_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={ap} inline>Action plan</Checkbox>;
        let pu_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={pu} inline>Parent update</Checkbox>;

        this.state.checkboxes[annot].forEach(function(e){
            switch(e){
                case "Strength":
                    str_checcked = <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={str} checked inline>Strengths</Checkbox >;
                    break;

                case "Weakness":
                    wk_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={wk} checked inline>Weaknesses</Checkbox>;
                    break;

                case "Action Plan":
                    ap_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={ap} checked inline>Action plan</Checkbox>;
                    break;

                case "Parent Update":
                    pu_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={pu} checked inline>Parent update</Checkbox>;
                    break;
            }
        }, this);

        return (
            <FormGroup>
                {
                    str_checcked
                }
                {' '}
                {
                    wk_checcked
                }
                {' '}
                {
                    ap_checcked
                }
                {' '}
                {
                    pu_checcked
                }
            </FormGroup>
        )
    }

    handleCheckboxChange(e){
        let valuepart = e.target.value.split('_');

        let currentcheckboxes = this.state.checkboxes;

        if(currentcheckboxes[valuepart[1]].includes(valuepart[0])){
            var index = currentcheckboxes[valuepart[1]].indexOf(valuepart[0]);
            currentcheckboxes[valuepart[1]].splice(index, 1);
        } else {
            currentcheckboxes[valuepart[1]].push(valuepart[0]);
        }

        this.setState({checkboxes: currentcheckboxes})

    }

    handleChange(event){
        this.setState({text: event.target.value})
    }

    onSubmit(event){

        event.preventDefault();

        let studentID = this.props.match.params.userID;
        let annotID = event.target.id;
        let modannot = this.state.modify;

        let index = modannot.indexOf(annotID);
        modannot.splice(index, 1);

        let filterTag = this.state.filterTags;

        let updatetags;

        if(this.state.checkboxes[annotID].length == 0){
            updatetags = null;
        } else {
            updatetags = this.state.checkboxes[annotID];
        }

        this.props.mutate({
            variables: {
                "annotationID": annotID,
                "annotation": {
                    "tags": updatetags,
                    "text": this.state.text
                }
            },
            refetchQueries: [{
                query: getAnnotations,
                variables: { tags: filterTag, text: this.state.text},
            }]
        }).then(() =>
            this.setState({modify: modannot})
        );
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
                                            {week.map(annotation => {
                                                if(!(annotation.deleted == true)){
                                                    if(annotation.contentType == "image"){
                                                        return (
                                                            <Panel className="annotation" key={annotation.annotationID}>
                                                                <div className="tag-container" >
                                                                    {/*if no tags then do not try to loop over it (Code breakage prevention)*/}
                                                                    { !(annotation.tags === null) ?
                                                                        annotation.tags.map(tag => {
                                                                            return(
                                                                                <p className="tag" key={tag}>{tag}</p>
                                                                            );
                                                                        }) : null
                                                                    }
                                                                </div>
                                                                <img src={annotation.mediaURL} />

                                                                <div>
                                                                    <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                                                    <DeleteAnnotation annotation={annotation} courseID={courseID}/>
                                                                </div>
                                                            </Panel>
                                                        );
                                                    }else if(annotation.contentType == "video"){
                                                        return (
                                                            <Panel className="annotation" key={annotation.annotationID}>
                                                                <div className="tag-container" >
                                                                    { !(annotation.tags === null) ?
                                                                        annotation.tags.map(tag => {
                                                                            return(
                                                                                <p className="tag" key={tag}>{tag}</p>
                                                                            );
                                                                        }) : null
                                                                    }
                                                                </div>
                                                                <ReactPlayer url={annotation.mediaURL} controls/>

                                                                <div>
                                                                    <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                                                    <p><DeleteAnnotation annotation={annotation} courseID={courseID}/></p>
                                                                </div>
                                                            </Panel>
                                                        );
                                                    }else if(annotation.contentType == "text"){
                                                        if(this.state.modify.includes(annotation.annotationID)){
                                                            return (
                                                                <Panel className="annotation" key={annotation.annotationID}>
                                                                    <form onSubmit={this.onSubmit.bind(this)} id={annotation.annotationID}>
                                                                        {
                                                                            this.preChecking(annotation.annotationID)
                                                                        }
                                                                        <p className="content-text"><input type="text" defaultValue={annotation.text} onChange={this.handleChange.bind(this)} /></p>

                                                                        <div className="annotation-bottom">
                                                                            <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                                                            <Button className="submit change" type="submit">Submit</Button>
                                                                            <p><DeleteAnnotation annotation={annotation} courseID={courseID}/></p>
                                                                        </div>
                                                                    </form>
                                                                </Panel>
                                                            );
                                                        } else {
                                                            return (
                                                                <Panel className="annotation" key={annotation.annotationID}>
                                                                    <a className="update" onClick={this.initiateUpdate.bind(this)} id={annotation.annotationID} href="#">Modify</a>
                                                                    <div className="tag-container">
                                                                        { !(annotation.tags === null) ?
                                                                            annotation.tags.map(tag => {
                                                                                return(

                                                                                    <p className="tag" key={tag}>{tag}</p>
                                                                                );
                                                                            }) : <p>No Feedback Type</p>
                                                                        }
                                                                    </div>
                                                                    <p></p>
                                                                    <p className="content-text">{annotation.text}</p>

                                                                    <div className="annotation-bottom">
                                                                        <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                                                        <p><DeleteAnnotation annotation={annotation} courseID={courseID}/></p>
                                                                    </div>
                                                                </Panel>
                                                            );
                                                        }
                                                    }else if(annotation.contentType == "audio"){
                                                        return (
                                                            <Panel className="annotation" key={annotation.annotationID}>
                                                                <div className="tag-container" >
                                                                    { !(annotation.tags === null) ?
                                                                        annotation.tags.map(tag => {
                                                                            return(
                                                                                <p className="tag" key={tag}>{tag}</p>
                                                                            );
                                                                        }) : null
                                                                    }
                                                                </div>
                                                                <ReactAudioPlayer src={annotation.mediaURL} controls />
                                                                <p className="content-text">{annotation.transcript}</p>

                                                                <div className="annotation-bottom">
                                                                    <p className="date"><Moment format="HH:mm - DD MMMM">{annotation.createdAt}</Moment></p>
                                                                    <p><DeleteAnnotation annotation={annotation} courseID={courseID}/></p>
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

/*
 * Mutation Query
 * @args $annotation: AnnotationInput!
 */
const mutation = gql`
    mutation UpdateAnnotationTag ($annotationID: ID! , $annotation: AnnotationInput!){
        updateAnnotation(annotationID:$annotationID, annotation:$annotation) {
        tags
        text
        } 
    }
`;


export default compose(
    graphql(mutation),
    graphql(getAnnotations, { options:  (props) => { return { variables: { courseID: props.match.params.courseID} } } },))(CoursePage);





