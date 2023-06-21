import gql from 'graphql-tag';

export default gql`
  type User {
    userId: String!
    email: String
    company: String
  }
  type Query {
    allUsers: [User!]!
  }
  type Mutation {
    addUser(
      userId: String!
      password: String!
      email: String
      company: String
    ): User
    checkUser(userId: String!, password: String!): User
  }
`;
