/**
 * Add Annotation Application
 * Composed of input text for annotation content, checkboxes for tags
 * TODO improve logic for tags to make it more dynamic
 */

import React, {Component} from 'react';
import { IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Panel, Button, FormGroup, Checkbox } from 'react-bootstrap';
import getStudentInfo from '../../queries/fetchAnnotations';
import CourseStudentQuery from '../../queries/fetchStudentsList'



class AddStudentAnnotation extends Component{
    constructor(props){
        super(props);

        this.state = {
            open: false,
            contentType: '',
            text: '',
            studentIDs: [props.studentID],
            teacherID: props.teacherID,
            annotTags: []

        };
    }

    //onSubmit create tags array and run the mutation, then set annotation content to empty
    onSubmit(event){
        event.preventDefault();

        let studentID = this.props.studentID;
        let teacherID = this.props.teacherID;
        let course = this.props.courseID;
        let tags = this.state.annotTags;
        
        let date = new Date();
        let local = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()+"."+date.getMilliseconds()+"Z";

        this.props.mutate({
            variables: {
                "annotation": {
                    contentType: "text",
                    text: this.state.text,
                    teacherID: teacherID,
                    studentIDs: [studentID],
                    tags: tags,
                    deleted: false,
                    courseID: course,
                    //localCreatedAt : local,
                }
            },
            refetchQueries: [{
                query: getStudentInfo,
                variables: { userID: studentID },
            },
                {
                    query: CourseStudentQuery,
                    variables: { teacherID: localStorage.getItem('userID') },
                }]
        }).then(() => this.setState({text: ''}));
    }

    handleChange(e){
        if(this.state.annotTags.includes(e.target.value)){
            var index = this.state.annotTags.indexOf(e.target.value);
            this.state.annotTags.splice(index, 1);
        } else {
            this.state.annotTags.push(e.target.value);
        }
    }

    render(){
        let tags = this.props.tags;

        return(
            <div className="text-tag">
                <Button className="add-annoation" bsSize="large" block onClick={ ()=> this.setState({ open: !this.state.open })}> + Add a comment</Button>
                <Panel collapsible expanded={this.state.open} >
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <textarea spellCheck="true" className="students" value= {this.state.text} onChange={event => this.setState({ text: event.target.value})}/>
                        <div className="formsubmit">
                            <FormGroup className="tags">
                                {
                                    tags.map((tag, index) => {
                                        return(
                                            <Checkbox onChange={this.handleChange.bind(this)} key={index} id={tag} value={tag} inline>
                                                {tag}
                                            </Checkbox >
                                        )
                                    })
                                }
                            </FormGroup>
                            <Button className="submit" type="submit">Submit</Button>
                        </div>
                    </form>
                </Panel>
            </div>
        )
    }
}

/*
 * Mutation Query
 * @args $annotation: AnnotationInput!
 */
const mutation = gql`
	mutation AddStudentAnnotation ($annotation: AnnotationInput!){
  		addAnnotation(annotation:$annotation)	
	}
`;

export default graphql(mutation)(AddStudentAnnotation);