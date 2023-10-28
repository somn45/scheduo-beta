import removeGraphQLTypename from '@/components/schedules/today/create-schedule.modal/utils/removeGraphQLTypename';
import {
  FollowerGraphQLQuery,
  FollowerGraphQLQueryWithChecked,
} from '@/types/interfaces/users.interface';
import { ChangeEvent, useEffect, useState } from 'react';

type useCheckBoxWithSharingUserType = ({
  followers,
}: useCheckBoxWithSharingUserProps) => [
  FollowerGraphQLQueryWithChecked[] | null,
  (e: ChangeEvent<HTMLInputElement>) => void
];

interface useCheckBoxWithSharingUserProps {
  followers: FollowerGraphQLQuery[] | null;
}

const useCheckBoxWithSharingUser: useCheckBoxWithSharingUserType = ({
  followers,
}) => {
  const [followersWithChecked, setFollowersWithChecked] = useState<
    FollowerGraphQLQueryWithChecked[] | null
  >(null);

  useEffect(() => {
    const followersWithChecked =
      followers &&
      followers.map((follower) => ({ ...follower, checked: false }));
    setFollowersWithChecked(followersWithChecked);
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

export default useCheckBoxWithSharingUser;
