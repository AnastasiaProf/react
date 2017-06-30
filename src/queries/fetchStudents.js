import gql from 'graphql-tag';

const StudentsQuery = gql`
  query StudentsQuery {
    students {
      userID
      lastName
      photoURL
    }
  }
`