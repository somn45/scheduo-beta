import { GraphQLScalarType } from 'graphql';
import gql from 'graphql-tag';

export default gql`
  scalar Date
  type User {
    _id: ID
    userId: String!
    name: String!
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
      name: String!
      email: String
      company: String
    ): User
    checkUser(userId: String!, password: String!): User
    logout: User!
    addFollower(id: String!): User!
    deleteFollower(userId: String!): User!
  }
`;

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Javascript date scalar type',
  serialize(value) {
    if (value instanceof Date) return value.getTime();
  },
  parseValue(value) {
    if (typeof value === 'number') return new Date(value);
  },
});
