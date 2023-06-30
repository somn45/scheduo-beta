import gql from 'graphql-tag';

export default gql`
  scalar Date
  type ToDo {
    content: String!
    registrant: String!
    registeredAt: Float!
    state: String!
  }
  type Query {
    getToDos: [ToDo]
  }
  type Mutation {
    addToDo(
      content: String!
      registrant: String!
      registeredAt: Float!
      state: String!
    ): ToDo
    updateToDo(
      content: String!
      registrant: String!
      registeredAt: Float!
    ): ToDo!
    deleteToDo(registrant: String!, registeredAt: Float!): ToDo!
  }
`;
