/**
 * Student List Component
 * Show all the student sof the teacher, grouped by class. Possibility of filter them by keying in a string.
 * TODO filter on lastname & firstname
 */

import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';


/*
 * Query to retrieve the students
 * @args $teacherID: ID
 */
const CourseStudentQuery = gql`
    query CourseStudentQuery($teacherID: ID){
        courses(teacherID: $teacherID) {
            students {
              userID
              firstName
              lastName
              email
              photoURL
              photoUID
              langCode
              createdAt
              updatedAt
            }
          courseID
          description
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

    //on new properties coming set StudentList.state.courses to the new query returned value
    componentWillReceiveProps(nextProps){
        if(!(nextProps.courses == undefined)){
            this.setState({courses: nextProps.courses});
        }
    }


    //onChange of the input text update StudentList.state.filter
    updateSearch (e) {
        let filter = this.state.filter;

        this.setState({filter: e.target.value})
    }

    arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}


    render() {


        if (this.props.loading){
            return <div>Loading...</div>;
        }

        let courses = this.props.courses;

        let studentsLast = [];
        let studentsFirst = [];
        let studentsDisplay = [];

        if(this.state.filter){
            {courses.map(course => {
                studentsLast[course.courseID] = course.students.filter( student =>
                    student.lastName.toLowerCase().match(this.state.filter.toLowerCase()) 
                );

                studentsFirst[course.courseID] = course.students.filter( student =>
                    student.firstName.toLowerCase().match(this.state.filter.toLowerCase())
                );

                studentsDisplay[course.courseID] = this.arrayUnique(studentsLast[course.courseID].concat(studentsFirst[course.courseID]))
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
                                  <h1>{course.description}</h1>
                                </div>
                                  {studentsDisplay[course.courseID].map(student => {
                                      return (
                                          <Col xs={4} md={2} key={student.userID} >
                                            <Thumbnail className="profile"> 
                                              <Link to={`${course.courseID}/students/${student.userID}/?oldurl=studentslist`}>
                                                <img src={student.photoURL} alt="student picture"/>
                                                <h4>{student.firstName} {student.lastName}</h4>
                                              </Link>
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