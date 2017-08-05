/**
 * Login Component
 * Uses JWT to authenticate teacher on the website
 */
import React, {Component} from 'react';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Redirect } from 'react-router-dom';


class Login extends Component{
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',

        };
    }

    onSubmit(e){
    	e.preventDefault();

        let email = this.state.email;
        let password = this.state.password;

        this.props.mutate({
            variables: {
                "email": email,
				"password": password
            }
        }).then((response) => {
            localStorage.setItem('token', response.data.authToken.token);
            localStorage.setItem('userID', response.data.authToken.user.userID);
            window.location.replace('/');
        });
	}


	render(){

		return(
			<div>
				<form onSubmit={this.onSubmit.bind(this)}>
				<input type="text" className="username" required placeholder="Email" value= {this.state.email} onChange={event => this.setState({ email: event.target.value})}/>
				<input type="password" className="password" required placeholder="Password" value= {this.state.password} onChange={event => this.setState({ password: event.target.value})}/>
					<button type="submit">Login</button>
				</form>
			</div>
		);
	}
}

/*
 * Mutation Query
 * @args $email: String!, $password: String!
 */
const mutation = gql`
	mutation AuthToken ($email: String!, $password: String!){
  		authToken(email: $email , password: $password){
  			token
  			user{
  				userID
				firstName
				lastName
				email
				role
				photoURL
				photoUID
				langCode
				createdAt
				updatedAt
  			}
		}
	}
`;

export default graphql(mutation)(Login);

