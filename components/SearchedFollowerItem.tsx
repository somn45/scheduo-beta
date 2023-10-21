import { buttonClickEvent } from '@/types/HTMLEvents';
import { IFollowerPreview } from '@/types/interfaces/users.interface';

interface SearchedFollowerItemProps {
  user: IFollowerPreview;
  handleAddFollower: (e: buttonClickEvent, userId: string) => Promise<void>;
}

export default function SearchedFollowerItem({
  user,
  handleAddFollower,
}: SearchedFollowerItemProps) {
  return (
    <li
      key={user.userId}
      className="w-1/4 p-1 border-2 rounded-md flex flex-row justify-between"
    >
      <div className="flex flex-col">
        <span className="mr-2 font-semibold">{user.name}</span>
        <span className="text-xs text-slate-500">{user.userId}</span>
      </div>
      {user.follow ? (
        <button
          disabled
          className="px-2 py-1 bg-blue-300 rounded-xl ease-out duration-75 text-white"
        >
          팔로우됨
        </button>
      ) : (
        <button
          onClick={(e) => handleAddFollower(e, user.userId)}
          className="px-2 py-1 bg-blue-300 rounded-xl ease-out duration-75 text-white hover:bg-blue-500"
        >
          팔로우
        </button>
      )}
    </li>
  );
}
