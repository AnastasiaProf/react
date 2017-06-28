import React, {Component} from 'react';
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

class Home extends Component{
  constructor(props) {
    super(props);

    this.state = {
      list: {},
    };
  }



  componentDidMount(e){
  	this.setState({list: this.child});

  }

  sortStud(e){
    this.setState({sortStud: e.target.value})
  }



  filterStud(e){
    this.setState({filterStud: e.target.value})
  }

	render(){
		return(
<div>
			<Grid>
    			<Row className="show-grid">
    				{/*dropdown for class*/}
      				<Col xs={6} md={4}>
      					<FormControl onChange={this.filterStud.bind(this.child)} componentClass="select" placeholder="select">
      						<option value="">All Classes</option>
        					<option value="class1">Class 1</option>
        					<option value="class2">Class 2</option>
        					<option value="class3">Class 3</option>
      					</FormControl>
      				</Col>
      				{/*dropdown for sorting by ...*/}
     	 			<Col xs={6} md={4} mdOffset={4}>
  						<FormControl onChange={this.sortStud.bind(this.child)} componentClass="select" placeholder="select">
        					<option value="name">Name</option>
        					<option value="fbmonth">Feedback this month</option>
        					<option value="fball">All feedback</option>
      					</FormControl>
     	 			</Col>
    			</Row>
        	</Grid>

			{/*display the list of students
			<StudentHomeList ref={(child) => { this.child = child; }}/>*/}

      <StudentHomeListTest />

			
</div>

		);
	}
}

export default Home;

