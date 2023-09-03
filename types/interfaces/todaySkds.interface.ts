interface BasicTodayScheduleInfo {
  title: string;
  author: string;
}

export interface TodaySchedule extends BasicTodayScheduleInfo {
  createdAt?: number;
  toDos: Array<IToDo>;
}

export interface TodayScheduleWithID extends TodaySchedule {
  _id?: string;
}

export interface IToDo {
  content: string;
  registeredAt: number;
  state: string; // toDo | willDone | done
}

export interface IDocedTodaySkd extends BasicTodayScheduleInfo {
  start: number;
  end: number;
  docedToDos: Array<IDocedToDo>;
}

export interface IDocedToDo {
  content: string;
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
