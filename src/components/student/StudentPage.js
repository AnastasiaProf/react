import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

class StudentPage extends Component{
 	render(){
 		console.log(this.props.match.params);
        return (
        	<div>
        		<Link to="/">Back</Link>
        		<h1>student ID: {this.props.match.params.userID}</h1>
        		<h2></h2>
        	</div>
        );
    }
}


const query = gql`
	{
	  students {
	    firstName
	  }
	}
`;

export default StudentPage;