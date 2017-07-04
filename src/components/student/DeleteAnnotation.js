import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import getStudentInfo from '../../queries/fetchAnnotations';


class DeleteAnnotation extends Component{
	
	onAnnotationDelete() {
		console.log(this);
		this.props.mutate({ 
			variables: {
				annotationID: this.props.annotation.annotationID,
				annotation:{
					deleted: true
				},
			},
			refetchQueries: [{ 
				query: getStudentInfo,
                variables: { userID: this.props.studentID }
            }]  
		});
	}

	render(){
		return(
			<Button className="delete-annotation" onClick={this.onAnnotationDelete.bind(this)}> Delete</Button>
		);
	}

}


const mutation = gql`
	mutation DeleteAnnotation ($annotationID: ID! , $annotation: AnnotationInput!){
	  updateAnnotation(annotationID:$annotationID, annotation:$annotation) {
	    deleted
	  } 
	}
`;

export default graphql(mutation)(DeleteAnnotation);