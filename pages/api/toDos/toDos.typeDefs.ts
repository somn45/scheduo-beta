import gql from 'graphql-tag';

export default gql`
  interface Schedule {
    _id: String!
    title: String!
    author: String!
  }
  type TodaySkd implements Schedule {
    _id: String!
    title: String!
    author: String!
    toDos: [ToDo!]!
  }
  type DocedTodaySkd implements Schedule {
    _id: String!
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
    addToDo(input: AddToDoAndUpdateToDoInput): ToDo!
    updateToDo(input: AddToDoAndUpdateToDoInput): ToDo!
    deleteToDo(input: DeleteToDoInput): [ToDo!]!
    updateToDoState(input: UpdateToDoStateInput): ToDo!
    finishToDos(title: String!): [ToDo!]!
    documentedToDos: [DocedTodaySkd!]!
  }
  input AddToDoAndUpdateToDoInput {
    id: String!
    content: String!
    registeredAt: Float!
  }
  input DeleteToDoInput {
    id: String!
    registeredAt: Float!
  }
  input UpdateToDoStateInput {
    hasFinished: Boolean!
    id: String!
    registeredAt: Float!
  }
`;
