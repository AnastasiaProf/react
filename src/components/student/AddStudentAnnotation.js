/**
 * Add Annotation Application
 * Composed of input text for annotation content, checkboxes for tags
 * TODO improve logic for tags to make it more dynamic
 */

import React, {Component} from 'react';
import { IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import TokenAutocomplete from 'react-token-autocomplete';
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
            defaultTags:[],

        };
    }

    //onSubmit create tags array and run the mutation, then set annotation content to empty
    onSubmit(event){
        event.preventDefault();

        let studentID = this.props.studentID;
        let teacherID = this.props.teacherID;
        let course = this.props.courseID;
        let defaultTags = this.props.defaultTags;
        
        let date = new Date();
        let local = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()+"."+date.getMilliseconds()+"Z";

        this.props.mutate({
            variables: {
                "annotation": {
                    contentType: "text",
                    text: this.state.text,
                    teacherID: teacherID,
                    studentIDs: [studentID],
                    tags: defaultTags,
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


    render(){
        return(
            <div className="text-tag">
                <Button className="add-annoation" bsSize="large" block onClick={ ()=> this.setState({ open: !this.state.open })}> + Add a comment</Button>
                <Panel collapsible expanded={this.state.open} >
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <textarea spellCheck="true" className="students" value= {this.state.text} onChange={event => this.setState({ text: event.target.value})}/>
                        <div className="formsubmit">
                            <TokenAutocomplete
                                placeholder="type to limit suggestions"
                                limitToOptions={true}
                                defaultValues={['apple']}
                                options={['apple', 'banana', 'carrot', 'watermelon']}/>

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