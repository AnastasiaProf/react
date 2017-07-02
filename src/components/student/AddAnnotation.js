import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';

const getStudentInfo = gql`
    query getStudentInfo($userID: ID!)
    {
        student(studentID: $userID) {
            lastName
            photoURL
        }
        annotations(filterStudentIDs: [$userID]) {
            annotationID
            contentType
            mediaURL
            thumbnailURL
            text
            transcript
            classDate
            createdAt
            updatedAt
            transcribedAt
        }
    }
`;

class AddAnnotation extends Component{
	constructor(props){
    	super(props);
    	this.state = {
     		open: false,
     		contentType: '',
     		text: '',
     		studentIDs: [],
     		teacherID: '',
     		tags:''
    	};
  	}

  	onSubmit(event){
		event.preventDefault();

		this.props.mutate({
			variables: {
				contentType: "text",
				text: this.state.text,
				teacherID: this.props.teacherID,
				studentIDs: [this.props.studentIDs],
				tags: this.state.tags},
				refetchQueries: [{getStudentInfo}]
		}).then(() => this.setState({text: " "}));
	}


	render(){
		return(
			<div>
				<Button bsSize="large" block onClick={ ()=> this.setState({ open: !this.state.open })}> + Add a comment</Button>
				<Panel collapsible expanded={this.state.open} >
				    <form onSubmit={this.onSubmit.bind(this)}>
				        <input value= {this.state.text} onChange={event => this.setState({ text: event.target.value})}/>
				    </form>
				</Panel>
			</div>
		)
	}

}

const mutation = gql`
	mutation AddAnnotation ($annotation:AnnotationInput){
  		addAnnotation(annotation:$annotation)	
	}
`;

export default graphql(mutation)(AddAnnotation);