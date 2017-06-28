import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { graphql ,gql} from 'react-apollo';
//import studentsQuery from '../../queries/fetchStudents';

class StudentHomeListTest extends React.Component {

	render(){

		if (this.props.data.loading) {
      		return (<div>Loading</div>)
    	}

    	if (this.props.data.error) {
      		console.log(this.props.data.error)
      		return (<div>An unexpected error occurred</div>)
    	}

		return this.props.data.students.map(student => {
			return (
				<li className="collection-item" key={student.lastName}>
				{student.lastName}
				</li>
			);
		});
	}

}

const StudentsQuery = gql`
  query StudentsQuery {
    students {
      lastName
      photoURL
    }
  }
`


const StudentsData = graphql(StudentsQuery)(StudentHomeListTest)

export default StudentsData
