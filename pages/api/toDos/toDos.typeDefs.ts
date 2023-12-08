import gql from 'graphql-tag';

export default gql`
  enum State {
    toDo
    willDone
    done
  }
  interface Schedule {
    _id: String!
    title: String!
    author: String!
  }
  type Follower {
    _id: String!
    userId: String!
    name: String!
    email: String
    company: String
  }
  type TodaySkd implements Schedule {
    _id: String!
    title: String!
    author: String!
    sharingUsers: [Follower!]!
    toDos: [ToDo!]!
  }
  type DocedTodaySkd implements Schedule {
    _id: String!
    title: String!
    author: String!
    start: Float!
    end: Float!
    sharingUsers: [Follower]
    docedToDos: [ToDo!]!
  }
  type ToDo {
    content: String!
    registeredAt: Float!
    updatedAt: Float!
    state: State!
  }
  type Query {
    allSchedules: [TodaySkd!]!
    getSchedule(id: String!): TodaySkd!
    allDocedTodaySkds(userId: String): [DocedTodaySkd!]
  }
  type Mutation {
    createSchedule(title: String!): TodaySkd!
    createScheduleWithFollowers(
      title: String!
      followers: [followersInput]
    ): TodaySkd!
    updateTitle(title: String!, _id: String!): TodaySkd!
    updateSharingUsers(_id: String!, sharingUsers: [followersInput]): TodaySkd!
    deleteSchedule(_id: String!): TodaySkd!
    addToDo(input: AddToDoAndUpdateToDoInput): ToDo!
    updateToDo(input: AddToDoAndUpdateToDoInput): ToDo!
    deleteToDo(input: DeleteToDoInput): [ToDo!]!
    updateToDoState(input: UpdateToDoStateInput): [ToDo!]!
    finishToDos(title: String!): [ToDo]!
    documentedToDos(userId: String): [DocedTodaySkd!]
  }
  input AddToDoAndUpdateToDoInput {
    id: String!
    registeredAt: Float!
    updatedAt: Float!
    content: String!
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
  input todayScheduleMemberInput {
    userId: String!
    name: String!
  }
  input followersInput {
    _id: String
    userId: String!
    name: String!
    email: String
    company: String
  }
`;
