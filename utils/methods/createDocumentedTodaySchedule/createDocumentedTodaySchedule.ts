import {
  TodayScheduleWithID,
  TodaySkdWithFollowers,
} from '@/types/interfaces/todaySkds.interface';
import getCurrentDay from '../getDate/getCurrentDay';
import {
  DocumentedTodaySchedule,
  DocumentedTodayScheduleWithAuthor,
} from '@/types/interfaces/documentedTodaySchedules.interface';

const createDocumentedTodaySchedule = (
  schedule: TodaySkdWithFollowers
): Array<DocumentedTodayScheduleWithAuthor> => {
  const docedScheduleTemplate = getDocedScheduleTemplate(schedule);

  const documentedSchedule: DocumentedTodayScheduleWithAuthor[] = [
    {
      ...docedScheduleTemplate,
      author: schedule.author,
    },
  ];
  const sharingUsers = schedule.sharingUsers;
  if (sharingUsers && sharingUsers.length > 0) {
    const documentedSchedules: DocumentedTodayScheduleWithAuthor[] = [
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

const getDocedScheduleTemplate = (
  schedule: TodayScheduleWithID
): DocumentedTodaySchedule => ({
  _id: schedule._id ? schedule._id : '',
  title: schedule.title,
  start: schedule.createdAt ? schedule.createdAt : Date.now(),
  end: getCurrentDay().getTime(),
  sharingUsers: schedule.sharingUsers
    ? schedule.sharingUsers.map((user) => ({
        userId: user.userId,
        name: user.name,
      }))
    : [],
  docedToDos: schedule.toDos,
});

export default createDocumentedTodaySchedule;
