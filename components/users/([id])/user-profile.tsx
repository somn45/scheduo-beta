import UserProfileItem from '@/components/common/listItem/UserProfileItem';
import { IUser } from '@/types/interfaces/users.interface';

export default function UserProfile({ user }: { user: IUser }) {
  return (
    <div className="w-full h-60 mb-5 px-3 flex flex-col items-center">
      <div className="w-full mb-5 flex flex-col items-center">
        <h1 className="text-xl font-semibold">{user.name}</h1>
        <span className="text-sm text-slate-400">{user._id}</span>
      </div>
      <ul className="w-full lg:w-1/2 flex flex-col">
        <UserProfileItem caption="아이디" value={user.userId} />
        <UserProfileItem
          caption="이메일"
          value={user.email ? user.email : '미등록'}
        />
        <UserProfileItem
          caption="소속 기업"
          value={user.company ? user.company : '미등록'}
        />
      </ul>
    </div>
  );
}
