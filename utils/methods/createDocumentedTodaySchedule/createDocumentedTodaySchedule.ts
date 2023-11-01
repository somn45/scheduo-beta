import { TodaySkdWithFollowers } from '@/types/interfaces/todaySkds.interface';
import getCurrentDay from '../getDate/getCurrentDay';
import {
  Event,
  EventWithAuthor,
} from '@/types/interfaces/documentedTodaySchedules.interface';

const createDocumentedTodaySchedule = (
  schedule: TodaySkdWithFollowers
): Array<EventWithAuthor> => {
  const docedScheduleTemplate = getDocedScheduleTemplate(schedule);

  const documentedSchedule: EventWithAuthor[] = [
    {
      ...docedScheduleTemplate,
      author: schedule.author,
    },
  ];
  const sharingUsers = schedule.sharingUsers;
  if (sharingUsers && sharingUsers.length > 0) {
    const documentedSchedules: EventWithAuthor[] = [
      ...documentedSchedule,
      ...sharingUsers.map((user) => ({
        ...docedScheduleTemplate,
        author: user.userId,
      })),
    ];
    return documentedSchedules;
  }
  return documentedSchedule;
};

const getDocedScheduleTemplate = (schedule: TodaySkdWithFollowers): Event => ({
  title: schedule.title,
  start: schedule.createdAt ? schedule.createdAt : Date.now(),
  end: getCurrentDay().getTime(),
  docedToDos: schedule.toDos,
});

export default createDocumentedTodaySchedule;
