import { TodayScheduleWithID } from '@/types/interfaces/todaySkds.interface';

export const filterMyTodaySchedules = (
  todaySchedules: TodayScheduleWithID[],
  user: { id: string }
) => todaySchedules.filter((todaySchedule) => todaySchedule.author === user.id);

export const filterTodayScheduleIncludeSharingUsers = (
  todaySchedules: TodayScheduleWithID[],
  user: { id: string }
) =>
  todaySchedules.filter((todaySchedule) =>
    todaySchedule.sharingUsers?.some(
      (sharingUser) => sharingUser.userId === user.id
    )
  );
