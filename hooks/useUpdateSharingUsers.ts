import removeGraphQLTypename from '@/components/schedules/today/create-schedule.modal/utils/removeGraphQLTypename';
import {
  FollowerGraphQLQuery,
  FollowerGraphQLQueryWithChecked,
  FollowerSearchItem,
  IFollower,
} from '@/types/interfaces/users.interface';
import { ChangeEvent, useEffect, useState } from 'react';

type useUpdateSharingUsersType = ({
  followers,
  sharingUsers,
}: useUpdateSharingUsers) => [
  FollowerGraphQLQueryWithChecked[] | null,
  (e: ChangeEvent<HTMLInputElement>) => void
];

interface useUpdateSharingUsers {
  followers: FollowerGraphQLQuery[] | null;
  sharingUsers?: IFollower[];
}

const useUpdateSharingUsers: useUpdateSharingUsersType = ({
  followers,
  sharingUsers,
}) => {
  const [followersWithChecked, setFollowersWithChecked] = useState<
    FollowerGraphQLQueryWithChecked[] | null
  >(null);

  useEffect(() => {
    if (sharingUsers) {
      const sharingUserIdList: Array<string> = [];

      sharingUsers.forEach((user) => sharingUserIdList.push(user.userId));

      const followersWithChecked =
        followers &&
        followers.map((follower) => ({
          ...follower,
          checked: sharingUserIdList.includes(follower.userId),
        }));

      setFollowersWithChecked(followersWithChecked);
    }
  }, [followers]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name } = e.target;
    if (followersWithChecked) {
      const followersRemovedTypename = followersWithChecked.map((follower) =>
        removeGraphQLTypename(follower)
      );
      setFollowersWithChecked(() =>
        followersRemovedTypename.map((follower) =>
          follower.userId === name
            ? { ...follower, checked: !follower.checked }
            : follower
        )
      );
    }
  };

  return [followersWithChecked, onChange];
};

export default useUpdateSharingUsers;
