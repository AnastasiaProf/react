/**
 * Home Component
 * Composed of the course filter & the sort dropdown for the student list
 * Child : StudentHomeList
 */

import React, {Component} from 'react';
import { graphql ,gql} from 'react-apollo';
import { Link } from 'react-router-dom';
import {FormControl} from 'react-bootstrap';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import StudentHomeList from '../student/StudentHomeList';

const CourseQuery = gql`    
    query StudentsQuery($courseID: ID!) {
        course(courseID: $courseID){
            description
        }
    }`;

class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            list: {},
            filterStud: ""
        };
    }



    componentDidMount(){
        this.setState({list: this.child});
    }

    //onChange set StudentHomeList.state.sortStud at dropdown value
    sortStud(e){
        this.child.setState({sortStud: e.target.value})
    }

    render(){
        let course = "";
        if (this.props.data.loading){
            return <div>Loading...</div>;
        }

        console.log(this)

        return(
            <div>
                <h2>{this.props.data.course.description}</h2>
                <Grid>
                    <Link className="btn btn-default" to={`/${this.props.match.params.teacherID}`}>Back</Link>
                    <Row className="show-grid">
                        {/*dropdown for sorting by ...*/}
                        <Col xs={6} md={4} mdOffset={4}>
                            <FormControl onChange={this.sortStud.bind(this)} componentClass="select" placeholder="select">
                                <option value="name">Name</option>
                                <option value="fbmonth">Feedback this month</option>
                                <option value="fball">All feedback</option>
                            </FormControl>
                        </Col>
                    </Row>
                </Grid>

                {/*assign StudentHomeList as a child and pass into it the selected Course object & the current teacherID*/}
                <StudentHomeList ref={(child) => {
                    if(!(child == null )){
                        this.child = child.getWrappedInstance();
                    }
                } } filterStudValue={this.props.match.params.courseID} teacherID={this.props.match.params.teacherID}
                />


            </div>

        );
    }
}

export default graphql(CourseQuery, {
    options:  (props) => {  { return { variables: { courseID: props.match.params.courseID} } } }
})(Home);

