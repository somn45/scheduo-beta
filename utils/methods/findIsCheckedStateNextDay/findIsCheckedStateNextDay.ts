import { IToDo, TodaySchedule } from '@/types/interfaces/todaySkds.interface';

const findIsCheckedStateNextDay = (
  todaySchedule: TodaySchedule,
  nextDaySharp: Date
) => {
  const partialFinishedToDos: IToDo[] = todaySchedule.toDos.map((toDo) => {
    if (isRegisteredAtNotToday(toDo, nextDaySharp) && toDo.state === 'willDone')
      return {
        content: toDo.content,
        registeredAt: toDo.registeredAt,
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
