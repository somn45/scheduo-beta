import { FollowerSearchItem } from '@/types/interfaces/users.interface';

interface MemberListModalProps {
  members?: FollowerSearchItem[];
  setShowsMemberList: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MemberListModal({
  members,
  setShowsMemberList,
}: MemberListModalProps) {
  return (
    <article
      className="w-full h-screen  bg-black/60 
  flex justify-center items-center z-20 fixed top-0 left-0"
    >
      <div
        className="w-1/4 px-8 py-5 rounded-[5px] text-sm bg-slate-50 
      flex flex-col items-center"
      >
        <div className="w-full flex justify-end">
          <button
            onClick={() => setShowsMemberList(false)}
            className="text-xl text-right font-semibold"
          >
            X
          </button>
        </div>
        <h2 className="text-xl font-semibold">멤버 목록</h2>
        <ul>
          {members &&
            members.map((user) => <li key={user.userId}>{user.name}</li>)}
        </ul>
      </div>
    </article>
  );
}
