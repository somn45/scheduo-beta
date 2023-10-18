import { TodaySkdWithFollowers } from '@/types/interfaces/todaySkds.interface';

// 내가 체크한 투두 찾기
const getFinishedToDo = (
  todaySchedule: TodaySkdWithFollowers,
  registeredAt: number
) => todaySchedule.toDos.filter((toDo) => toDo.registeredAt === registeredAt);

export default getFinishedToDo;
