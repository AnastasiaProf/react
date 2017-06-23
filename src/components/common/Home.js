import React, {Component} from 'react';
import SplitButton from 'react-bootstrap/lib/SplitButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';

import StudentList from '../student/StudentList';

class Home extends Component{
	render(){
		return(
<div>
			<Grid>
    			<Row className="show-grid">
    				{/*dropdown for class*/}
      				<Col xs={6} md={8}><code>
      					<SplitButton title="select class" pullRight id="split-button-pull-right">
			    			<MenuItem eventKey="1">Class 1</MenuItem>
			    			<MenuItem eventKey="2">Class 2</MenuItem>
			   				<MenuItem eventKey="3">Class 3</MenuItem>
			  			</SplitButton>
      				</code></Col>
      				{/*dropdown for sorting by ...*/}
     	 			<Col xs={6} md={4}><code>
     	 			<SplitButton title="sort by" pullRight id="split-button-pull-right">
			    			<MenuItem eventKey="1">students</MenuItem>
			    			<MenuItem eventKey="2">annotations</MenuItem>
			   				<MenuItem eventKey="3">something else</MenuItem>
			  			</SplitButton>
     	 			</code></Col>
    			</Row>
        	</Grid>

			{/*display the list of students*/}
			<StudentList/>

			
</div>

		);
	}
}

export default Home;

