import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';

class StudentPage extends Component{
 	render(){
 		console.log(this.props.match.params);
        return (
        	<div>
        		<Link to="/">Back</Link>
        		<h1>student ID: {this.props.match.params.userID}</h1>
        	</div>
        );
    }
}

export default StudentPage;