/**
 * Student Annotations Component
 * Used in StudentPage for diplay and update of the annotations
 * Child : DeleteStudentAnnotations
 */
import React, {Component} from 'react';
import {Panel, Button, Checkbox, FormGroup} from 'react-bootstrap';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import Moment from 'react-moment';
import DeleteClassAnnotation from './DeleteClassAnnotation';
import getAnnotations from '../../queries/fetchClassAnnotations';




class CourseAnnotations extends Component{
    constructor(props){
        super(props);

        this.state = {
            filterAnnot: "",
            all : true,
            modify: [],
            checkboxes: []
        }
    }

    //Initialization on update annotation click
    initiateUpdate(event){
        event.preventDefault();

        let current = this.state.modify;
        current.push(event.target.id);

        let currentcheckboxes = this.state.checkboxes;
        currentcheckboxes[event.target.id] = [];

        let result = this.props.annotations.filter(function( obj ) {
            return obj.annotationID == event.target.id;
        })[0];

        if(!(result.tags === null)){
            result.tags.forEach(function(e){
                currentcheckboxes[event.target.id].push(e)
            });
        }


        this.setState({modify: current, checkboxes: currentcheckboxes})
    }

    //If annotation is being updated will initialize checkbobxes state
    preChecking(annot){

        let str = "Strengths_"+annot;
        let wk = "Weaknesses_"+annot;
        let ap = "Action Plan_"+annot;
        let pu = "Parent update_"+annot;

        let str_checcked = <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={str} inline>Strengths</Checkbox >;
        let wk_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={wk} inline>Weaknesses</Checkbox>;
        let ap_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={ap} inline>Action plan</Checkbox>;
        let pu_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={pu} inline>Parent update</Checkbox>;

        this.state.checkboxes[annot].forEach(function(e){
            switch(e){
                case "Strengths":
                    str_checcked = <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={str} checked inline>Strengths</Checkbox >;
                    break;

                case "Weaknesses":
                    wk_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={wk} checked inline>Weaknesses</Checkbox>;
                    break;

                case "Action Plan":
                    ap_checcked =  <Checkbox onChange={this.handleCheckboxChange.bind(this)} value={ap} checked inline>Action Plan</Checkbox>;
                    break;

                case "Parent update":
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

    //Handle checkboxes state changes
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

    //Handle text changes
    handleChange(event){
        this.setState({text: event.target.value})
    }

    //Submit of the update form
    onSubmit(event){

        event.preventDefault();

        let annotID = event.target.id;
        let modannot = this.state.modify;
        let teacherID = localStorage.getItem('userID');
        let courseID = this.props.courseID;

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
                annotationID: annotID,
                annotation: {
                    contentType: "text",
                    teacherID: teacherID,
                    courseID: courseID,
                    tags: updatetags,
                    text: this.state.text
                }
            },
            refetchQueries: [{
                query: getAnnotations,
                variables: { tags: filterTag, text: this.state.text, courseID: courseID},
            }]
        }).then(() =>
            this.setState({modify: modannot})
        );
    }


    //Render annotation HTML depending of their type
    render(){


        var week = this.props.week;
        let courseID = this.props.courseID;

        return(
            <div>
                {week.map(annotation => {
                    if(!(annotation.deleted == true)){
                        let tag_verif = false;
                        if(!(annotation.tags === null)){
                            if(!(annotation.tags.length == 0)){
                                tag_verif = true;
                            }
                        }
                        if(annotation.contentType == "image"){
                            return (
                                <Panel className="annotation" key={annotation.annotationID}>
                                    <div className="tag-container" >
                                        {/*if no tags then do not try to loop over it (Code breakage prevention)*/}
                                        { tag_verif ?
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
                                        <DeleteClassAnnotation annotation={annotation} courseID={courseID}/>
                                    </div>
                                </Panel>
                            );
                        }else if(annotation.contentType == "video"){
                            return (
                                <Panel className="annotation" key={annotation.annotationID}>
                                    <div className="tag-container" >
                                        { tag_verif ?
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
                                        <p><DeleteClassAnnotation annotation={annotation} courseID={courseID}/></p>
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
                                                <p><DeleteClassAnnotation annotation={annotation} courseID={courseID}/></p>
                                            </div>
                                        </form>
                                    </Panel>
                                );
                            } else {
                                return (
                                    <Panel className="annotation" key={annotation.annotationID}>
                                        <a className="update" onClick={this.initiateUpdate.bind(this)} id={annotation.annotationID} href="#">Modify</a>
                                        <div className="tag-container">
                                            { tag_verif ?
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
                                            <p><DeleteClassAnnotation annotation={annotation} courseID={courseID}/></p>
                                        </div>
                                    </Panel>
                                );
                            }
                        }else if(annotation.contentType == "audio"){
                            return (
                                <Panel className="annotation" key={annotation.annotationID}>
                                    <div className="tag-container" >
                                        { tag_verif ?
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
                                        <p><DeleteClassAnnotation annotation={annotation} courseID={courseID}/></p>
                                    </div>
                                </Panel>
                            );
                        }
                    }
                })}
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



export default  graphql(mutation)(CourseAnnotations);

