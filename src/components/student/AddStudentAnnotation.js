/**
 * Add Annotation Application
 * Composed of input text for annotation content, checkboxes for tags
 * TODO improve logic for tags to make it more dynamic
 */

import React, {Component} from 'react';
import { IndexRoute} from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Checkbox from 'react-bootstrap/lib/Checkbox';
import getStudentInfo from '../../queries/fetchAnnotations';
import CourseStudentQuery from '../../queries/fetchStudentsList'



class AddStudentAnnotation extends Component{
    constructor(props){
        super(props);

        this.state = {
            open: false,
            contentType: '',
            text: '',
            studentIDs: [props.studentID],
            teacherID: props.teacherID,
            strength: '',
            weakness: '',
            action: '',
            parent: '',

        };
    }

    //onSubmit create tags array and run the mutation, then set annotation content to empty
    onSubmit(event){
        event.preventDefault();

        let studentID = this.props.studentID;
        let teacherID = this.props.teacherID;
        let course = this.props.courseID;
        let tags = [];

        if(!(this.state.strength) == ""){
            tags.push("Strengths")
        }

        if(!(this.state.weakness) == ""){
            tags.push("Weaknesses")
        }

        if(!(this.state.action) == ""){
            tags.push("Action Plan")
        }

        if(!(this.state.parent) == ""){
            tags.push("Parent update")
        }


        let date = new Date();
        let local = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "T" +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()+"."+date.getMilliseconds()+"Z";

        this.props.mutate({
            variables: {
                "annotation": {
                    contentType: "text",
                    text: this.state.text,
                    teacherID: teacherID,
                    studentIDs: [studentID],
                    tags: tags,
                    deleted: false,
                    courseID: course,
                    //localCreatedAt : local,
                }
            },
            refetchQueries: [{
                query: getStudentInfo,
                variables: { userID: studentID },
            },
                {
                    query: CourseStudentQuery,
                    variables: { teacherID: localStorage.getItem('userID') },
                }]
        }).then(() => this.setState({text: ''}));
    }

    //Handle strength checkbox change
    handleChangeStrength(){
        if(this.state.strength == ""){
            this.setState({strength: "on"})
        } else {
            this.setState({strength: ""})
        }
    }

    //Handle weakness checkbox change
    handleChangeWeakness(){
        if(this.state.weakness == ""){
            this.setState({weakness: "on"})
        } else {
            this.setState({weakness: ""})
        }
    }

    //Handle action checkbox change
    handleChangeAction(){
        if(this.state.action == ""){
            this.setState({action: "on"})
        } else {
            this.setState({action: ""})
        }
    }

    //Handle parent checkbox change
    handleChangeParent(){
        if(this.state.parent == ""){
            this.setState({parent: "on"})
        } else {
            this.setState({parent: ""})
        }
    }

    render(){
        return(
            <div className="text-tag">
                <Button className="add-annoation" bsSize="large" block onClick={ ()=> this.setState({ open: !this.state.open })}> + Add a comment</Button>
                <Panel collapsible expanded={this.state.open} >
                    <form onSubmit={this.onSubmit.bind(this)}>
                        <textarea spellCheck="true" className="students" value= {this.state.text} onChange={event => this.setState({ text: event.target.value})}/>
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

/*
 * Mutation Query
 * @args $annotation: AnnotationInput!
 */
const mutation = gql`
	mutation AddStudentAnnotation ($annotation: AnnotationInput!){
  		addAnnotation(annotation:$annotation)	
	}
`;

export default graphql(mutation)(AddStudentAnnotation);