import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';



const CourseStudentQuery = gql`
    query CourseStudentQuery($teacherID: ID){
        courses(teacherID: $teacherID) {
            students {
              userID
              lastName
              email
              photoURL
              photoUID
              langCode
              createdAt
              updatedAt
            }
          courseID
          courseName
          createdAt
          updatedAt
        }
    }
    `;

class StudentList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: null,
            courses: []
        };
    }


    componentWillReceiveProps(nextProps){
        if(!(nextProps.courses == undefined)){
            this.setState({courses: nextProps.courses});
        }
    }



    updateSearch (e) {
        let filter = this.state.filter;

        this.setState({filter: e.target.value})
    }



    render() {


        if (this.props.loading){
            return <div>Loading...</div>;
        }

        let courses = this.props.courses;

        let studentsDisplay = [];


        if(this.state.filter){
            {courses.map(course => {
                studentsDisplay[course.courseID] = course.students.filter( student =>
                    student.lastName.toLowerCase().match(this.state.filter.toLowerCase())
                )
            })}
        } else {
            {courses.map(course => {
                studentsDisplay[course.courseID] = course.students
            })}
        }



        return (
            <div>
              <Grid>
                <input className="search" type="text" placeholder="Search for a student by name" onChange={this.updateSearch.bind(this)}/>
                  {courses.map(course => {
                      if(studentsDisplay[course.courseID].length > 0){
                          return (
                              <Row key={course.courseID}>
                                <div className="classetitle">
                                  <h1>{course.courseName}</h1>
                                </div>
                                  {studentsDisplay[course.courseID].map(student => {
                                      return (
                                          <Col xs={4} md={2} key={student.userID} >
                                            <Thumbnail className="profile"> <img src={student.photoURL} alt="student picture"/>
                                              <Link to={`students/${student.userID}/?oldurl=studentslist`}><h3>{student.lastName}</h3></Link>
                                            </Thumbnail>
                                          </Col>
                                      );
                                  })}
                              </Row>
                          );
                      }
                  })}
              </Grid>
            </div>
        );
    }

}


export default graphql(CourseStudentQuery, {
    props: ({data: { loading, courses }}) => ({
        loading,
        courses,
    })},)(StudentList);