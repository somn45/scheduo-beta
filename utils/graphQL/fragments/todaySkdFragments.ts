import { gql } from '@/generates/type';

const TODAY_SCHEDULE_LIST = gql(`
  fragment TodayScheduleField on TodaySkd {
    title
    author
  }
`);

const TODAY_SCHEDULE_LIST_INCLUDES_ID = gql(`
fragment TodaySkdIncludesIDField on TodaySkd {
  _id
  ...TodayScheduleField
}
`);

const TODAY_SCHEDULE_TODOS = gql(`
  fragment CoreToDosField on ToDo {
    content
    registeredAt
  }
`);

const TODAY_SCHEDULE_TOODS_INCLUDES_STATE = gql(`
fragment ToDosIncludesStateField on ToDo {
  ...CoreToDosField
  state
}
`);

const DOCUMENTED_TODAY_SCHEDULE_LIST = gql(`
  fragment DocumentedTodaySkdField on DocedTodaySkd {
    title
    author
    start
    end
    docedToDos {
      content
    }
  }
`);
