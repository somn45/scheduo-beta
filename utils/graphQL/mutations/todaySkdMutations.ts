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

export const ADD_TODO = gql(`
  mutation AddToDo($id: String!, $content: String!, $registeredAt: Float!) {
    addToDo(input: {id: $id, content: $content, registeredAt: $registeredAt}) {
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
  mutation UpdateToDo($id: String!, $content: String!, $registeredAt: Float!) {
    updateToDo(input: {id: $id, content: $content, registeredAt: $registeredAt}) {
      content
      registeredAt
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
