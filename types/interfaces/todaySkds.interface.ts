import { FollowerSearchItem, IFollower } from './users.interface';

interface BasicTodayScheduleInfo {
  title: string;
  author: string;
}

export interface TodaySchedule extends BasicTodayScheduleInfo {
  createdAt?: number;
  toDos: Array<IToDo>;
}

export interface TodaySkdWithFollowers extends TodaySchedule {
  sharingUsers?: IFollower[];
}

export interface TodayScheduleWithID extends TodaySkdWithFollowers {
  _id?: string;
}

export interface IToDo {
  content: string;
  registeredAt: number;
  updatedAt: number;
  state: 'toDo' | 'willDone' | 'done';
}

export interface ITodoWithId extends IToDo {
  id: string;
}

export type todaySchedulePreview = Pick<TodaySchedule, 'title' | 'author'>;

// 후에 유니크 값을 content로 바꿀 예정
export type todayScheduleUniqueField = Pick<ITodoWithId, 'id' | 'registeredAt'>;

export type todayScheduleWithoutState = Omit<ITodoWithId, 'state'>;

export interface UpdateToDoStateProps extends todayScheduleUniqueField {
  hasFinished: boolean;
}
