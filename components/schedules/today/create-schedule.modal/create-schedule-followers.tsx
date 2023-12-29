import { ChangeEvent } from 'react';
import {
  FollowerGraphQLQuery,
  FollowerGraphQLQueryWithChecked,
} from '@/types/interfaces/users.interface';

interface CreateScheduleFollowersProps {
  followers: FollowerGraphQLQueryWithChecked[] | null;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function CreateScheduleFollowers({
  followers,
  onChange,
}: CreateScheduleFollowersProps) {
  if (!followers || followers.length === 0)
    return (
      <li className="flex justify-center items-center">팔로워가 없습니다.</li>
    );
  return followers.map((follower) => (
    <li key={follower.userId}>
      <div className="flex flex-row">
        <input
          type="checkbox"
          name={follower.userId}
          checked={follower.checked}
          onChange={onChange}
        />
        <h5>{follower.name}</h5>
        <span>{`(${follower.userId})`}</span>
      </div>
    </li>
  ));
}
