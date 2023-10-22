import { IToDo } from '@/types/interfaces/todaySkds.interface';

const findIsCheckedStateNextDay = (toDos: IToDo[], nextDaySharp: Date) => {
  const partialFinishedToDos: IToDo[] = toDos.map((toDo) => {
    if (isRegisteredAtNotToday(toDo, nextDaySharp) && toDo.state === 'willDone')
      return {
        ...toDo,
        state: 'done',
      };
    else if (isRegisteredAtNotToday(toDo, nextDaySharp))
      return {
        ...toDo,
        registeredAt: toDo.registeredAt + 1000 * 60 * 60 * 24,
      };
    else return toDo;
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
