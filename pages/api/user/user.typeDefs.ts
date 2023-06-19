import gql from 'graphql-tag';

export default gql`
  type User {
    name: String!
  }
  type Query {
    allUsers: [User!]!
  }
`;
