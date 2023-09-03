import { gql } from '@/generates/type';

export const ALL_SCHEDULES = gql(`
  query GetScheduleList {
    allSchedules {
      ...TodaySkdIncludesIDField
      toDos {
        ...ToDosIncludesStateField
      }
    }
  }
`);

export const GET_SCHEDULE = gql(`
query GetSchedule($id: String!) {
  getSchedule(id: $id) {
    ...TodaySkdIncludesIDField
    toDos {
      ...ToDosIncludesStateField
    }
  }
}
`);
