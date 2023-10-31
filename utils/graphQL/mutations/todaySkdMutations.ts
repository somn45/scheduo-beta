import { gql } from '@/generates/type';

export const CREATE_SCHEDULE = gql(`
  mutation CreateSchedule($title: String!) {
    createSchedule(title: $title) {
      ...TodaySkdIncludesIDField
      toDos {
        ...ToDosIncludesStateField
      }
    }
  }
`);

export const CREATE_SCHEDULE_WITH_FOLLOWERS = gql(`
  mutation CreateScheduleWithFollowers($title: String!, $followers: [followersInput]) {
    createScheduleWithFollowers(title: $title, followers: $followers) {
      ...TodayScheduleField
    }
  }
`);

export const UPDATE_TODAY_SKD_TITLE = gql(`
  mutation UpdateTodaySkdTitle($title: String!, $_id: String!) {
    updateTitle(title: $title, _id: $_id) {
      _id
      title
    }
  }
`);

export const DELETE_SCHEDULE = gql(`
  mutation DeleteScheDule($_id: String!) {
    deleteSchedule(_id: $_id) {
      _id
    }
  }
`);

export const ADD_TODO = gql(`
  mutation AddToDo($id: String!, $content: String!, $registeredAt: Float!, $updatedAt: Float!) {
    addToDo(input: {id: $id, content: $content, registeredAt: $registeredAt, updatedAt: $updatedAt}) {
      ...ToDosIncludesStateField
    }
  }
`);

export const FINISH_TODOS = gql(`
mutation FinishToDos($title: String!) {
  finishToDos(title: $title) {
    ...ToDosIncludesStateField
  }
}
`);

export const UPDATE_TODO = gql(`
  mutation UpdateToDo($id: String!, $content: String!, $registeredAt: Float!, $updatedAt: Float!) {
    updateToDo(input: {id: $id, content: $content, registeredAt: $registeredAt, updatedAt: $updatedAt}) {
      content
      registeredAt
      updatedAt
    }
  }
`);

export const DELETE_TODO = gql(`
mutation DeleteToDo($id: String!, $registeredAt: Float!) {
  deleteToDo(input: {id: $id, registeredAt: $registeredAt}) {
    ...ToDosIncludesStateField
  }
}
`);

export const UPDATE_TODO_STATE = gql(`
mutation UpdateToDoState(
  $hasFinished: Boolean!
  $id: String!
  $registeredAt: Float!
) {
  updateToDoState(
    input: {    
      hasFinished: $hasFinished
      id: $id
      registeredAt: $registeredAt}
  ) {
    ...ToDosIncludesStateField
  }
}
`);

export const ALL_DOCUMENTED_TODAY_SKDS = gql(`
  query AllDocedTodaySkds {
    allDocedTodaySkds {
      ...DocumentedTodaySkdField
    }
  }
`);

export const DOCUMENTED_TODOS = gql(`
mutation DocumentedToDos {
  documentedToDos {
    ...DocumentedTodaySkdField
  }
}
`);
