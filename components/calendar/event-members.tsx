import { FollowerSearchItem } from '@/types/interfaces/users.interface';

export default function EventMembers({ user }: { user: FollowerSearchItem }) {
  return (
    <li
      className="px-1 py-1 bg-slate-500 rounded-lg text-white
    flex justify-center align-center"
    >
      <p>{`${user.name}(${user.userId})`}</p>
    </li>
  );
}
