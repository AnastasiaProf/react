import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';

class StudentHomeList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      students: [],
    };
  }


 componentDidMount(){
        // Static data
        const data = [
            {
        "userID":1,
        "class":"class1",
        "annotations": 2,
        "annotationsmonth": 8,
        "lastName": "Zhou",
        "email": null,
        "photoURL": "http://odinplus.ef.cn/Contact/Photo/16528659",
        "photoUID": null,
        "langCode": "en_US",
        "createdAt": "2017-06-22T19:43:22.270Z",
        "updatedAt": "2017-06-22T19:43:22.270Z"
      },
      {
        "userID":2,
        "class":"class2",
        "annotations": 51,
        "annotationsmonth": 1,
        "lastName": "Chen",
        "email": null,
        "photoURL": "http://odinplus.ef.cn/Contact/Photo/19319576",
        "photoUID": null,
        "langCode": "en_US",
        "createdAt": "2017-06-22T19:43:22.270Z",
        "updatedAt": "2017-06-22T19:43:22.270Z"
      },
      {
        "userID":3,
        "class":"class3",
        "annotations": 12,
        "annotationsmonth": 5,
        "lastName": "Geng",
        "email": null,
        "photoURL": "http://odinplus.ef.cn/Contact/Photo/23641604",
        "photoUID": null,
        "langCode": "en_US",
        "createdAt": "2017-06-22T19:43:22.270Z",
        "updatedAt": "2017-06-22T19:43:22.270Z"
      },
      {
        "userID":4,
        "class":"class2",
        "annotations": 95,
        "annotationsmonth": 3,
        "lastName": "Wang",
        "email": null,
        "photoURL": "http://odinplus.ef.cn/Contact/Photo/23726886",
        "photoUID": null,
        "langCode": "en_US",
        "createdAt": "2017-06-22T19:43:22.270Z",
        "updatedAt": "2017-06-22T19:43:22.270Z"
      }
        ];
        // Update state
        this.setState({students: data});
    }

  dynamicSort(property) {
      var sortOrder = 1;
      if(property[0] === "-") {
          sortOrder = -1;
          property = property.substr(1);
      }
      return function (a,b) {
          var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
          return result * sortOrder;
      }
  }


  returnLink(prop, annot =false){
    if(annot){
      switch(annot){
        case "fball":
          return <Link to={`students/${prop.userID}`}><h3>{prop.lastName} - {prop.annotations}</h3></Link>
          break;

        case "fbmonth":
          return <Link to={`students/${prop.userID}`}><h3>{prop.lastName} - {prop.annotationsmonth}</h3></Link>
          break;
      }
    } else {
      return <Link to={`students/${prop.userID}`}><h3>{prop.lastName}</h3></Link>
    }
  }


  render() {
    let students = this.state.students;


    if(this.state.sortStud){
      switch(this.state.sortStud) {
          case "name":
            students.sort(this.dynamicSort("lastName"));
            break;

          case "fbmonth"://TODO
            var annot = "fbmonth";

            var currentTime = new Date();
            var month = currentTime.getMonth() + 1;
            var year = currentTime.getFullYear();
            students.sort(this.dynamicSort("annotationsmonth"));
            break;

          case "fball":
            var annot = "fball";
            students.sort(this.dynamicSort("annotations"));
            break;

          default:
            students.sort(this.dynamicSort("lastName"));
            break;

      }
    }

    if(this.state.filterStud){
      students = students.filter( student =>
      student.class.includes(this.state.filterStud))
    }

    return (
      <div >
        <Grid>
          <Row>
            {students.map(student => {
              return (
                <Col xs={4} md={2} key={student.userID}>
                  <Thumbnail className="profile"> <img src={student.photoURL} alt="student profile picture"/>
                  {this.returnLink(student,annot)}
                  </Thumbnail>
                </Col>
              )
            })}
          </Row>
        </Grid>
      </div>
    );
  }

}


export default StudentHomeList;