import React, {Component} from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';

import StudentList from '../student/StudentList';


class Students extends Component{
	render(){
		var teacherID = window.location.pathname.split("/")[1];
		return(
			<div>
        		{/*display the list of students*/}
        		<StudentList teacherID={teacherID}/>
     		</div>
		);
	}
}

export default Students;

