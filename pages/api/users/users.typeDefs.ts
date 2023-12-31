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
    getUser: User
    getUserById(id: String!): User!
    allFollowers(userId: String): [User!]
    searchFollowers(name: String!): [User!]!
    searchFollowersById(id: String!): User!
    checkCurrentPassword(_id: String!, password: String!): User!
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
    editUser(_id: String!, name: String!, email: String, company: String): User!
    editUserPassword(_id: String!, password: String!): User!
    deleteUser(_id: String!, password: String!): User!
    addFollower(userId: String!, profileUserId: String!): User!
    deleteFollower(userId: String!, profileUserId: String!): User!
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
