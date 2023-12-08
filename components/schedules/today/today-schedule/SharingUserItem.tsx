import {
  FollowerGraphQLQuery,
  FollowerGraphQLQueryWithChecked,
} from '@/types/interfaces/users.interface';
import { ChangeEvent } from 'react';

interface SharingUsersItemProps {
  followers: FollowerGraphQLQueryWithChecked[] | null | undefined;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SharingUsersItem({
  followers,
  onChange,
}: SharingUsersItemProps) {
  return followers?.map((follower) => (
    <li key={follower.userId}>
      <div className="flex">
        <input
          type="checkbox"
          name={follower.userId}
          checked={follower.checked}
          onChange={onChange}
        />
        <p>{`${follower.name}(${follower.userId})`}</p>
      </div>
    </li>
  ));
}
