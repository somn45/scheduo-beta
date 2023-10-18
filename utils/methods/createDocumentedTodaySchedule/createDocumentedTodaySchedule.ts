import { TodaySkdWithFollowers } from '@/types/interfaces/todaySkds.interface';

const createDocumentedTodaySchedule = (schedule: TodaySkdWithFollowers) => {
  const docedScheduleTemplate = getDocedScheduleTemplate(schedule);

  const documentedSchedule = {
    ...docedScheduleTemplate,
    author: schedule.author,
  };
  const sharingUsers = schedule.sharingUsers;
  if (sharingUsers && sharingUsers.length > 0)
    return [
      documentedSchedule,
      ...sharingUsers.map((user) => ({
        ...docedScheduleTemplate,
        author: user.userId,
      })),
    ];
  return documentedSchedule;
};

const getDocedScheduleTemplate = (schedule: TodaySkdWithFollowers) => ({
  title: schedule.title,
  start: schedule.createdAt && new Date(schedule.createdAt),
  end: schedule.createdAt && new Date(schedule.createdAt + 1000 * 60 * 60 * 24),
  docedToDos: schedule.toDos,
});

export default createDocumentedTodaySchedule;
