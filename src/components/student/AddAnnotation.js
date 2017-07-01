import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';


class AddAnnotation extends Component{
	constructor(...args){
    	super(...args);
    	this.state = {
     		open: false
    	};
  	}

	render(){
		return(
			<div>
				<Button bsSize="large" block onClick={ ()=> this.setState({ open: !this.state.open })}> + Add a comment</Button>
				<Panel collapsible expanded={this.state.open} >
				    <FormGroup controlId="formControlsTextarea">
				        <FormControl componentClass="textarea"/>
				    </FormGroup>
				</Panel>
			</div>
		)
	}

}

export default AddAnnotation;