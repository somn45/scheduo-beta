import { checkboxEvent } from '@/types/HTMLEvents';
import { IFollowers } from '@/types/interfaces/users.interface';
import { SetStateAction, useState } from 'react';

interface FollowerToShareProps {
  follower: IFollowers;
  setSharingFollowers: React.Dispatch<SetStateAction<IFollowers[]>>;
}

export default function FollowerToShare({
  follower,
  setSharingFollowers,
}: FollowerToShareProps) {
  const [checked, setChecked] = useState(false);

  const handleChangeFollowerAdded = (e: checkboxEvent) => {
    if (checked) {
      setSharingFollowers((sharingFollowers) =>
        sharingFollowers.filter(
          (sharingFollower) => sharingFollower.userId !== follower.userId
        )
      );
      setChecked(false);
    } else {
      setSharingFollowers((sharingFollowers) => [
        ...sharingFollowers,
        follower,
      ]);
      setChecked(true);
    }
  };
  return (
    <li>
      <div className="flex flex-row">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChangeFollowerAdded}
        />
        <h5>{follower.name}</h5>
        <span>{`(${follower.userId})`}</span>
      </div>
    </li>
  );
}
