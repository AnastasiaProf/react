/**
 * Students Component
 * Wrapper for StudentList, pass teacherID
 * Child : StudentHomeList
 */
import React, {Component} from 'react';

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

