import { TodaySkdWithFollowers } from '@/types/interfaces/todaySkds.interface';
import { FollowerSearchItem } from '@/types/interfaces/users.interface';

const checkAuthorizeTodaySchedule = (
  todaySchedule: TodaySkdWithFollowers,
  user: { id: string }
) => {
  const hasAccessTodaySkd = getHasAccessTodaySkd(todaySchedule, user);
  const { sharingUsers } = todaySchedule;

  if (sharingUsers)
    return hasAccessTodaySkd ||
      HasAccessTodaySkdWithSharingUsers(sharingUsers, user)
      ? true
      : false;

  return hasAccessTodaySkd ? true : false;
};

const HasAccessTodaySkdWithSharingUsers = (
  sharingUsers: FollowerSearchItem[],
  user: { id: string }
) => {
  const sharedTodaySkd = getsharedTodaySkd(sharingUsers, user);
  return sharedTodaySkd.length !== 0 ? true : false;
};

const getHasAccessTodaySkd = (
  todaySchedule: TodaySkdWithFollowers,
  user: { id: string }
) => todaySchedule.author === user.id;

const getsharedTodaySkd = (
  sharingUsers: FollowerSearchItem[],
  user: { id: string }
) => sharingUsers.filter((follwer) => follwer.userId === user.id);

export default checkAuthorizeTodaySchedule;
