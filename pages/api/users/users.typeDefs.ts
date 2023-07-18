import gql from 'graphql-tag';

export default gql`
  type User {
    _id: ID
    userId: String!
    email: String
    company: String
  }
  type Query {
    allUsers: [User!]!
    getUser: User!
    getUserById(id: String!): User
    allFollowers(userId: String!): [User!]!
  }
  type Mutation {
    addUser(
      userId: String!
      password: String!
      email: String
      company: String
    ): User
    checkUser(userId: String!, password: String!): User
    logout: User!
    addFollower(id: String!): User!
    deleteFollower(userId: String!): User!
  }
`;
