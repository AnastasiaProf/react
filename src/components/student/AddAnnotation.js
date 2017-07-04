import React, {Component} from 'react';
import { Switch, Router, Route, BrowserRouter, Link, IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Checkbox from 'react-bootstrap/lib/Checkbox';
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
            strength: '',
            weakness: false,
            action: false,
            parent: false,

        };
    }


    onSubmit(event){
        event.preventDefault();

        let studentID = this.props.studentID;
        let teacherID = this.props.teacherID;
        console.log(this)
        let tags = [];

        if(!(this.state.strength) == ""){
            tags.push("Strenght")
        }

        if(!(this.state.weakness) == ""){
            tags.push("Weakness")
        }

        if(!(this.state.action) == ""){
            tags.push("Action Plan")
        }

        if(!(this.state.parent) == ""){
            tags.push("Parent Update")
        }

        if(tags.length == 0){
            tags = ["No Feedback type"]
        }
        console.log(tags)
        this.props.mutate({
            variables: {
                "annotation": {
                    contentType: "text",
                    text: this.state.text,
                    teacherID: teacherID,
                    studentIDs: [studentID],
                    tags: tags
                }
            },
            refetchQueries: [{
                query: getStudentInfo,
                variables: { userID: studentID },
            }]
        }).then(() => this.setState({text: ''}));
    }


    handleChangeStrength(){
        if(this.state.strength == ""){
            this.setState({strength: "on"})
        } else {
            this.setState({strength: ""})
        }
    }

    handleChangeWeakness(){
        if(this.state.weakness == ""){
            this.setState({weakness: "on"})
        } else {
            this.setState({weakness: ""})
        }
    }

    handleChangeAction(){
        if(this.state.action == ""){
            this.setState({action: "on"})
        } else {
            this.setState({action: ""})
        }
    }

    handleChangeParent(){
        if(this.state.parent == ""){
            this.setState({parent: "on"})
        } else {
            this.setState({parent: ""})
        }
    }

    render(){
        return(
			<div>
				<Button bsSize="large" block onClick={ ()=> this.setState({ open: !this.state.open })}> + Add a comment</Button>
				<Panel collapsible expanded={this.state.open} >
					<form onSubmit={this.onSubmit.bind(this)}>
						<input className="students" value= {this.state.text} onChange={event => this.setState({ text: event.target.value})}/>
                        <div className="formsubmit">
                            <FormGroup className="tags">
                                <Checkbox onChange={this.handleChangeStrength.bind(this)} value={this.state.strength_value} inline>
                                    Strengths
                                </Checkbox >
                                {' '}
                                <Checkbox onChange={this.handleChangeWeakness.bind(this)} value={this.state.weakness_value} inline>
                                    Weaknesses
                                </Checkbox>
                                {' '}
                                <Checkbox onChange={this.handleChangeAction.bind(this)} value={this.state.action_value} inline>
                                    Action plan
                                </Checkbox>
                                {' '}
                                <Checkbox onChange={this.handleChangeParent.bind(this)} value={this.state.parent_value} inline>
                                    Parent update
                                </Checkbox>
                            </FormGroup>
                            <Button className="submit" type="submit">Submit</Button>
                        </div>
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