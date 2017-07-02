import React, {Component} from 'react';
import { graphql ,gql} from 'react-apollo';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import {ControlLabel} from 'react-bootstrap';
import {FormControl} from 'react-bootstrap';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';

//import StudentHomeList from '../student/StudentHomeList';
import StudentHomeListTest from '../student/StudentHomeListTest';


const CourseQuery = gql`
  query CourseQuery($teacherID: ID!) {
    courses(teacherID: $teacherID) {
      courseID
      courseName
      description
      courseStartDate
      courseEndDate
      courseStartWeekCode
      courseEndWeekCode
      createdAt
      updatedAt
    }
    }
`;

class Home extends Component{
  constructor(props) {
    super(props);

    this.state = {
      list: {},
      filterStud: ""
    };
  }



  componentDidMount(e){
  	this.setState({list: this.child});

  }

  sortStud(e){
    this.child.setState({sortStud: e.target.value})
  }



  filterStud(e){
    this.setState({filterStud: e.target.value})
  }

	render(){
    if (this.props.data.loading){
      return <div>Loading...</div>;
    }

    let course = "";

    if(this.state.filterStud == ""){
      course = this.props.data.courses[0].courseID;
    } else {
      course =  this.state.filterStud;
    }


		return(
    <div>
			<Grid>
    			<Row className="show-grid">
    				{/*dropdown for class*/}
      				<Col xs={6} md={4}>
      					<FormControl onChange={this.filterStud.bind(this)} componentClass="select" placeholder="select">
                {this.props.data.courses.map(course => {
                  return (
                    <option key={course.courseID} value={course.courseID}>{course.description}</option>
                  );
                })}
      					</FormControl>
      				</Col>
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

      <StudentHomeListTest ref={(child) => {
        if(!(child == null )){
          this.child = child.getWrappedInstance();
        }
      } } filterStudValue={course} teacherID={this.props.match.params.teacherID}
        />

			
</div>

		);
	}
}

export default graphql(CourseQuery, {
  options:  (props) => {  { return { variables: { teacherID: props.match.params.teacherID } } } }
})(Home);

