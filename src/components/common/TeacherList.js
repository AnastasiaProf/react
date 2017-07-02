import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { graphql ,gql} from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';
//import StudentsQuery from '../../queries/fetchStudents';

const TeacherQuery = gql`
  query TeacherQuery {
    teachers {
      userID
      firstName
      lastName
      email
      role
      photoURL
      photoUID
      langCode
      createdAt
      updatedAt
    }
  }
`

class TeacherList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teachers: [],
    };
  }

  componentWillReceiveProps(props){
  }

  componentDidMount(){
  }



  renderTeachers(){
    let teachers = this.props.data.teachers;


    return (
      <ul>
      {teachers.map((teacher) => {
            return (
              <li key={teacher.userID}><Link to={`/${teacher.userID}`}><h3>{teacher.firstName} {teacher.lastName}</h3></Link></li>
            );
      })}
      </ul>
    );
  }

  render(){
    if (this.props.data.loading){
      return <div>Loading...</div>;
    } 
    return(
      <div>
        <Grid>
          <Row>
            {this.renderTeachers()}
          </Row>
        </Grid>
      </div>
    );
  }


}




export default graphql(TeacherQuery)(TeacherList)
