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

    return toDo;
  });
  return partialFinishedToDos;
};

const isRegisteredAtNotToday = (toDo: IToDo, nextDaySharp: Date) =>
  new Date(toDo.registeredAt).getDay() !== nextDaySharp.getDay() &&
  toDo.registeredAt < nextDaySharp.getTime();

export default findIsCheckedStateNextDay;
