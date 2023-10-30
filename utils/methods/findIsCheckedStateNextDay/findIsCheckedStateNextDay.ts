import { IToDo } from '@/types/interfaces/todaySkds.interface';

const findIsCheckedStateNextDay = (toDos: IToDo[], nextDaySharp: Date) => {
  const partialFinishedToDos: IToDo[] = toDos.map((toDo) => {
    if (isRegisteredAtNotToday(toDo, nextDaySharp)) {
      if (toDo.state === 'willDone') {
        toDo.state = 'done';
      } else toDo.registeredAt += 1000 * 60 * 60 * 24;
    }
    return toDo;
  });
  return partialFinishedToDos;
};

const isRegisteredAtNotToday = (toDo: IToDo, nextDaySharp: Date) => {
  return (
    new Date(toDo.registeredAt + 1000 * 60 * 60 * 24).getDate() <
      nextDaySharp.getDate() && toDo.registeredAt < nextDaySharp.getTime()
  );
};

export default findIsCheckedStateNextDay;
