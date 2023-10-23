import { IFollower, IUser } from '@/types/interfaces/users.interface';
import { Dispatch, SetStateAction } from 'react';
import MyFollowerItem from './my-follower-item';

interface MyFollowerListProps {
  user: IUser;
  myFollowers: IFollower[];
  setShowsFollowModal: Dispatch<SetStateAction<boolean>>;
}

export default function MyFollowerList({
  user,
  myFollowers,
  setShowsFollowModal,
}: MyFollowerListProps) {
  return (
    <article className="w-1/2 flex flex-col items-center">
      <div className="w-full flex justify-between">
        <p className="w-1/3"></p>
        <h3 className="w-1/3 mb-3 text-lg font-semibold text-center">
          팔로워 목록
        </h3>
        <div className="w-1/3 flex justify-center items-center">
          <button
            onClick={() => setShowsFollowModal(true)}
            className="px-2 py-1 border rounded-md hover:bg-slate-200 focus:bg-slate-200"
          >
            팔로워 추가+
          </button>
        </div>
      </div>
      <div className="w-full px-20 grid gap-4 grid-cols-4">
        <ul>
          {myFollowers &&
            myFollowers.map((follower) => (
              <MyFollowerItem
                key={follower.userId}
                follower={follower}
                profileUserId={user._id ? user._id : ''}
              />
            ))}
        </ul>
      </div>
    </article>
  );
}
