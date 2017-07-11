import gql from 'graphql-tag';

const getStudentInfo = gql`
    query getStudentInfo($userID: ID!, $tags: [String])
    {
        student(studentID: $userID) {
            firstName
            lastName
            photoURL
        }
        annotations(filterStudentIDs: [$userID]) {
            annotationID
            contentType
            mediaURL
            thumbnailURL
            text
            tags
            transcript
            classDate
            createdAt
            updatedAt
            transcribedAt
            deleted
        }
        filteredAnnotation : annotations(filterStudentIDs: [$userID], tags: $tags) {
            annotationID
            contentType
            mediaURL
            thumbnailURL
            text
            tags
            transcript
            classDate
            createdAt
            updatedAt
            transcribedAt
            deleted
        }
    }
`;

export default getStudentInfo;