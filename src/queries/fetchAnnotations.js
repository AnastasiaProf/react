/**
 * Created by Thomas on 2/07/2017.
 */
import gql from 'graphql-tag';

const getStudentInfo = gql`
    query getStudentInfo($userID: ID!, $tags: [String])
    {
        student(studentID: $userID) {
            firstName
            lastName
            photoURL
        }
        annotations(filterStudentIDs: [$userID], tags: $tags) {
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
        }
    }
`;

export default getStudentInfo;