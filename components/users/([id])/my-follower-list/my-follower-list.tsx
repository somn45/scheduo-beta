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
    <div className="w-full flex flex-col items-center">
      <div className="w-full text-center flex justify-center">
        <h3 className="mr-2 text-sm md:text-lg font-semibold">팔로워</h3>
        <div className="flex justify-center items-center">
          <button
            onClick={() => setShowsFollowModal(true)}
            className="px-2 border-none rounded-md text-xl font-semibold hover:bg-slate-300"
          >
            +
          </button>
        </div>
      </div>
      <div className="w-full px-10">
        <ul
          className="w-full mt-5 grid gap-4 
        grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 
        place-items-center"
        >
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
    </div>
  );
}
