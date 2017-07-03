import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import { graphql ,gql} from 'react-apollo';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Thumbnail from 'react-bootstrap/lib/Thumbnail';
//import StudentsQuery from '../../queries/fetchStudents';

const StudentsQuery = gql`
  query StudentsQuery($courseID: ID!, $teacherID: ID!) {
    students(courseID: $courseID) {
      userID
      firstName
      lastName
      photoURL
    }
    annotations(filterTeacherID: $teacherID){
    annotationID
    createdAt
        students{
            userID
        }
    }
  }`;


class StudentHomeListTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sortStud: "name"
        };
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



    countAnnot(array, month = false){
        let counterarray = [];

        // Return today's date and time
        var currentTime = new Date()

        // returns the month (from 0 to 11)
        var current_month = currentTime.getMonth() + 1


        // returns the year (four digits)
        var current_year = currentTime.getFullYear()

        if(!(array == undefined)){

            array.forEach(function(e){

                let dates = e.createdAt.split("-");


                if(!(e.students[0] === null) && !(e.students[0] === undefined) ){
                    if(!(e.students[0].userID === undefined)){
                        if(month && current_month == dates[1] && current_year == dates[0]){
                            if(counterarray[e.students[0].userID] == undefined){
                                counterarray[e.students[0].userID] = 0;
                            } else {
                                counterarray[e.students[0].userID] += 1;
                            }
                        } else if(!month){
                            if(counterarray[e.students[0].userID] == undefined){
                                counterarray[e.students[0].userID] = 0;
                            } else {
                                counterarray[e.students[0].userID] += 1;
                            }
                        }
                    }
                }
            });
        }
        this.props.data.students.forEach(function(e){
            if(!counterarray.hasOwnProperty(e.userID)){
                counterarray[e.userID] = 0;
            }
        });
        return counterarray;
    }

    sortName(students) {
        return students.concat().sort(this.dynamicSort("lastName"));
    }

    sortAnnotAll(students, annotations) {
        return students.concat().sort(function(a, b){
            if (annotations[a.userID] < annotations[b.userID])
                return -1;
            if (annotations[a.userID] > annotations[b.userID])
                return 1;

            return 0;
        });
    }



    renderStudents(){
        let students = [];

        let annotations = [];

        let annot = false;

        if(this.state.sortStud){
            switch(this.state.sortStud) {
                case "name":
                    students = this.sortName(this.props.data.students);
                    break;

                case "fbmonth"://TODO

                    annot = true;
                    annotations = this.countAnnot(this.props.data.annotations, true);
                    students = this.sortAnnotAll(this.props.data.students, annotations);
                    break;


                case "fball"://Comprends pas erreur
                    annot = true;
                    annotations = this.countAnnot(this.props.data.annotations);
                    students = this.sortAnnotAll(this.props.data.students, annotations);
                    break;

                default:
                    students = this.sortName(this.props.data.students);

                    break;

            }
        }

        var teacherID = this.props.teacherID;

        return students.map(({firstName, lastName, photoURL, userID}) => {
            let annot_nbr = "";

            if(annot){
                annot_nbr = ' - '+annotations[userID];
            }
            return (
                <Col xs={4} sm={4} md={3} key={userID}>
                    <Thumbnail className="profile">
                        <img src={photoURL} alt="student profile picture"/>
                        <Link to={`/${teacherID}/students/${userID}/?oldurl=home`}><h3>{firstName} {lastName}{annot_nbr}</h3></Link>;
                    </Thumbnail>
                </Col>
            );
        });
    }

    render(){
        if (this.props.data.loading){
            return <div>Loading...</div>;
        }
        console.log(this)
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




export default graphql(StudentsQuery, {
    withRef: true,
    options:  (props) => {  { return { variables: { courseID: props.filterStudValue, teacherID: props.teacherID} } } }
})(StudentHomeListTest)
/*
 export default StudentHomeListTest*/