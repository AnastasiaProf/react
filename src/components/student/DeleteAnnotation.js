/**
 * Delete Annotation Component
 * Composed of the course filter & the sort dropdown for the student list
 * Child : StudentHomeListTest
 */

import React, {Component} from 'react';
import { IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Button from 'react-bootstrap/lib/Button';
import getStudentInfo from '../../queries/fetchAnnotations';


class DeleteAnnotation extends Component{

	//onClick call the mutation and refetch data
	onAnnotationDelete() {
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

/*
 * Mutation Query
 * @args $annotationID: ID! , $annotation: AnnotationInput!
 */
const mutation = gql`
	mutation DeleteAnnotation ($annotationID: ID! , $annotation: AnnotationInput!){
	  updateAnnotation(annotationID:$annotationID, annotation:$annotation) {
	    deleted
	  } 
	}
`;

export default graphql(mutation)(DeleteAnnotation);