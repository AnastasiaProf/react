import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';

class StudentList extends React.Component {
  constructor(props) {
    super(props);

     const data = [
      {
        "courseID": 1,
        "courseName": "Class 1",
        "students": [
          {
            "userID":1,
            "class":"class1",
            "lastName": "Zhou",
            "email": null,
            "photoURL": "http://odinplus.ef.cn/Contact/Photo/16528659",
            "photoUID": null,
            "langCode": "en_US",
            "createdAt": "2017-06-22T19:43:22.270Z",
            "updatedAt": "2017-06-22T19:43:22.270Z"
          },
          {
            "userID":3,
            "class":"class1",
            "lastName": "Geng",
            "email": null,
            "photoURL": "http://odinplus.ef.cn/Contact/Photo/23641604",
            "photoUID": null,
            "langCode": "en_US",
            "createdAt": "2017-06-22T19:43:22.270Z",
            "updatedAt": "2017-06-22T19:43:22.270Z"
          }
        ],
        "description": "HFC (Sun 13:15)",
        "courseStartDate": "2016-11-19T16:00:00.000Z",
        "courseEndDate": "2017-06-10T16:00:00.000Z",
        "courseStartWeekCode": "1647",
        "courseEndWeekCode": "1724",
        "createdAt": "2017-06-22T10:05:57.715Z",
        "updatedAt": "2017-06-22T10:05:57.715Z"
      },
      { 
        "courseID": 2,
        "courseName": "Class 2",
        "students": [
           {
             "userID":4,
             "class":"class2",
             "lastName": "Wang",
             "email": null,
             "photoURL": "http://odinplus.ef.cn/Contact/Photo/23726886",
             "photoUID": null,
             "langCode": "en_US",
             "createdAt": "2017-06-22T19:43:22.270Z",
             "updatedAt": "2017-06-22T19:43:22.270Z"
           }
        ],
        "description": "HFC (Sun 10:00)",
        "courseStartDate": "2016-11-19T16:00:00.000Z",
        "courseEndDate": "2017-06-10T16:00:00.000Z",
        "courseStartWeekCode": "1647",
        "courseEndWeekCode": "1724",
        "createdAt": "2017-06-22T10:05:57.715Z",
        "updatedAt": "2017-06-22T10:05:57.715Z"
      },
      {
        "courseID": 3,
        "courseName": "Class 3",
        "students": [
                  {
            "userID":2,
            "class":"class3",
            "lastName": "Chen",
            "email": null,
            "photoURL": "http://odinplus.ef.cn/Contact/Photo/19319576",
            "photoUID": null,
            "langCode": "en_US",
            "createdAt": "2017-06-22T19:43:22.270Z",
            "updatedAt": "2017-06-22T19:43:22.270Z"
          }
        ],
        "description": "HFD (Fri 16:00)",
        "courseStartDate": "2017-03-02T16:00:00.000Z",
        "courseEndDate": "2017-08-10T16:00:00.000Z",
        "courseStartWeekCode": "1710",
        "courseEndWeekCode": "1733",
        "createdAt": "2017-06-22T10:05:57.715Z",
        "updatedAt": "2017-06-22T10:05:57.715Z"
      }];

    this.state = {
      courses: data,
      filter: null 
    };
  }

  filter (students) {
    if (!this.props.filter) {
      return students
    }
    return students.filter((student) => student.lastName.toLowerCase().match(this.state.filter.toLowerCase()))
  }

  updateSearch (e) {
    let filter = this.state.filter;
    
    this.setState({filter: e.target.value})
  }


  render() {
    const courses = this.state.courses;
    console.log(courses[0])
    if(this.state.filter){
      {courses.map(course => {
        course.studentsDisplay = course.students.filter( student => 
          student.lastName.toLowerCase().match(this.state.filter.toLowerCase())
        )
      })}
    } else {
      {courses.map(course => {
        course.studentsDisplay = course.students
      })}
    }

    return (
    <div>
      <Grid>
        <input className="search" type="text" placeholder="Search for a student by name" onChange={this.updateSearch.bind(this)}/>
        {courses.map(course => {
          if(course.studentsDisplay.length > 0){
            return (
              <Row key={course.courseID}>
                <div className="classetitle">
                  <h1>{course.courseName}</h1>
                </div>
                {course.studentsDisplay.map(student => {
                  return (
                    <Col xs={4} md={2} key={student.userID} >
                      <Thumbnail className="profile"> <img src={student.photoURL} alt="student picture"/>
                        <Link to={`students/${student.userID}`}><h3>{student.lastName}</h3></Link>
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
/*    return (
    <div>
      <Grid>
        <Row>
        {students.map(student => {
          return (
        <Col xs={6} md={4} key={student.userID}>
          <Thumbnail> <img src={student.photoURL} alt="242x200"/>
            <Link to={`students/${student.userID}`}><h3>{student.lastName}</h3></Link>
          </Thumbnail>
        </Col>
          )
        })}
    </Row>
      </Grid>
        </div>
    );*/
  }

}


export default StudentList;