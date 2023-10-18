import { TodaySkdWithFollowers } from '@/types/interfaces/todaySkds.interface';
import getFinishedToDo from './getFinishedToDo';
import includeUpdatedToDo from './includeUpdatedToDo';

const setTodayStateWillDone = (
  todaySchedule: TodaySkdWithFollowers,
  registeredAt: number
) => {
  const finishedToDo = getFinishedToDo(todaySchedule, registeredAt)[0];
  finishedToDo.state = 'willDone';

  const updatedToDos = includeUpdatedToDo({
    todaySchedule,
    registeredAt,
    finishedToDo,
  });

  return updatedToDos;
};

export default setTodayStateWillDone;
