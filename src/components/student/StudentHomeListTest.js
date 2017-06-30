import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { graphql ,gql} from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';
//import StudentsQuery from '../../queries/fetchStudents';

const StudentsQuery = gql`
  query StudentsQuery {
    students {
      userID
      lastName
      photoURL
    }
  }
`

class StudentHomeListTest extends React.Component {



// const query = `
//   {
//     students { 
//       lastName 
//     } 
//   }`
// console.log(fetch('https://effeedbackapp-qa.herokuapp.com/api/graphql', {
//         method: 'POST',
//         headers: {
//           'accept':'application/json',
//           'content-type': 'application/json'
//         },
//         body: JSON.stringify({"query": query, "variables": null})
//         }).then(function (response) {
//             return response.text();
//         }).then(data => {
//             console.log('Here is the data: ', data);
//           }
//     ));


//       return(null)

  renderStudents(){

    console.log(this);
    
    return this.props.data.students.map(({lastName, photoURL, userID}) => {
      return (

          <Col xs={4} md={2} key={userID}>
            <Thumbnail className="profile"> 
              <img src={photoURL} alt="student profile picture"/>
              <Link to={`/students/${userID}`}><h3>{lastName}</h3></Link>
            </Thumbnail>
          </Col>
      );
    });
  }

  render(){
    if (this.props.data.loading){
      return <div>Loading...</div>;
    }
    return(
      <div>
        <Grid>
          <Row>
            {this.renderStudents()}
          </Row>
        </Grid>
      </div>
    );
  }


}




export default graphql(StudentsQuery)(StudentHomeListTest)
/*
export default StudentHomeListTest*/