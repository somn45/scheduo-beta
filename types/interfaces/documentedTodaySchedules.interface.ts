interface EventSharingUser {
  userId: string;
  name: string;
}

export interface DocumentedTodaySchedule {
  _id: string;
  title: string;
  start: number;
  end: number;
  sharingUsers: Array<EventSharingUser>;
  docedToDos: Array<DocedToDos>;
}

export interface DocumentedTodayScheduleWithAuthor
  extends DocumentedTodaySchedule {
  author: string;
}

export interface Event extends Omit<DocumentedTodayScheduleWithAuthor, '_id'> {
  id: string;
}

export interface DocedToDos {
  content: string;
}
