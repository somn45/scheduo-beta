import { IToDo } from '@/types/interfaces/todaySkds.interface';

const findIsCheckedStateNextDay = (toDos: IToDo[], currentDay: Date) => {
  const partialFinishedToDos: IToDo[] = toDos.map((toDo) => {
    if (isRegisteredAtNotToday(toDo, currentDay)) {
      if (toDo.state === 'willDone') {
        toDo.state = 'done';
      } else toDo.updatedAt = currentDay.getTime();
    }
    return toDo;
  });
  return partialFinishedToDos;
};

const isRegisteredAtNotToday = (toDo: IToDo, currentDay: Date) => {
  return (
    new Date(toDo.updatedAt).getDate() !== currentDay.getDate() &&
    toDo.updatedAt < currentDay.getTime()
  );
};

export default findIsCheckedStateNextDay;
