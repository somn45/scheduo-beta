import gql from 'graphql-tag';

export default gql`
  type TodaySkd {
    _id: String
    title: String!
    author: String!
    toDos: [ToDo!]!
  }
  type DocedTodaySkd {
    _id: String
    title: String!
    author: String!
    start: Float!
    end: Float!
    docedToDos: [ToDo!]!
  }
  type ToDo {
    content: String!
    registeredAt: Float!
    state: String!
  }
  type Query {
    allSchedules: [TodaySkd!]!
    getSchedule(id: String!): TodaySkd!
    allToDos: [ToDo]!
    allDocedTodaySkds: [DocedTodaySkd!]!
  }
  type Mutation {
    createSchedule(title: String!): TodaySkd!
    addToDo(id: String!, content: String!, registeredAt: Float!): ToDo!
    updateToDo(id: String!, content: String!, registeredAt: Float!): ToDo!
    deleteToDo(id: String!, registeredAt: Float!): [ToDo!]!
    updateToDoState(
      hasFinished: Boolean!
      id: String!
      registeredAt: Float!
    ): ToDo!
    finishToDos(title: String!): [ToDo!]!
    documentedToDos: [DocedTodaySkd!]!
  }
`;
