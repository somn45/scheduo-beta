import {
  IToDo,
  TodaySkdWithFollowers,
} from '@/types/interfaces/todaySkds.interface';

interface IncludeUpdateToDoProps {
  todaySchedule: TodaySkdWithFollowers;
  registeredAt: number;
  finishedToDo: IToDo;
}

// 업데이트된 toDo의 상태를 반영하기
const includeUpdatedToDo = ({
  todaySchedule,
  registeredAt,
  finishedToDo,
}: IncludeUpdateToDoProps) =>
  todaySchedule.toDos.map((toDo) =>
    toDo.registeredAt === registeredAt ? finishedToDo : toDo
  );

export default includeUpdatedToDo;
