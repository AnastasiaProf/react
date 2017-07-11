/**
 * Configuration Component
 * TODO
 */
import React, {Component} from 'react';

class Configuration extends Component{
	render(){
		return(
			<div>
				<FormGroup>
 					<Radio name="radioGroup" value="https://effeedbackapp-qa.herokuapp.com/api/graphql">
						https://effeedbackapp-qa.herokuapp.com/api/graphql
					</Radio>
                    {' '}
					<Radio name="radioGroup" value="https://effeedbackapp.herokuapp.com/api/graphql">
						https://effeedbackapp.herokuapp.com/api/graphql
					</Radio>
				</FormGroup>
			</div>
		);
	}
}

export default Configuration;