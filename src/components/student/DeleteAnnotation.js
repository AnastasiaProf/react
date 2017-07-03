import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import getStudentInfo from '../../queries/fetchAnnotations';


class DeleteAnnotation extends Component{

	render(){
		return(
			<Button className="delete-annotation"> Delete</Button>
		);
	}

}

export default DeleteAnnotation;