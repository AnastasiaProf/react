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


  render() {
    let students = this.state.students;
    // console.log(champions);
    // console.log('props: ', this.props);

    if(this.state.filterStud){
      students = students.filter( student =>
      student.class.includes(this.state.filterStud))
    }

    

    if(this.state.sortStud){

    }



    return (
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
    );
  }

}


export default StudentHomeList;