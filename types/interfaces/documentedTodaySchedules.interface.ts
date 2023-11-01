interface BasicTodayScheduleInfo {
  title: string;
  author: string;
}

export interface Event {
  title: string;
  start: number;
  end: number;
  docedToDos: Array<DocedToDos>;
}

export interface EventWithAuthor extends Event {
  author: string;
}

export interface DocedToDos {
  content: string;
}
