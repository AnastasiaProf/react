import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import getStudentInfo from '../../queries/fetchAnnotations';

class AddAnnotation extends Component{
    constructor(props){
        super(props);

        this.state = {
            open: false,
            contentType: '',
            text: '',
            studentIDs: [props.studentID],
            teacherID: props.teacherID,
            tags:''
        };
    }


    onSubmit(event){
        event.preventDefault();
        let studentID = this.props.studentID;
        let teacherID = this.props.teacherID;

        this.props.mutate({
            variables: {
                "annotation": {
                    contentType: "text",
                    text: this.state.text,
                    teacherID: teacherID,
                    studentIDs: [studentID],
                    tags: this.state.tags
                }
            },
            refetchQueries: [{
                query: getStudentInfo,
                variables: { userID: studentID },
            }]
        }).then(() => this.setState({text: ''}));
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
	mutation AddAnnotation ($annotation: AnnotationInput!){
  		addAnnotation(annotation:$annotation)	
	}
`;

export default graphql(mutation)(AddAnnotation);