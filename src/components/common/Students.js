import React, {Component} from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';

import StudentList from '../student/StudentList';


class Students extends Component{
	render(){
		return(
			<div>
        		{/*display the list of students*/}
        		<StudentList/>
     		</div>
		);
	}
}

export default Students;

