/**
 * Created by Thomas on 2/07/2017.
 */
import gql from 'graphql-tag';

const getStudentInfo = gql`
    query getStudentInfo($userID: ID!)
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
        }
    }
`;

export default getStudentInfo;