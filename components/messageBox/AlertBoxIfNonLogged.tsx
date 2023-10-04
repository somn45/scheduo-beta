import { useRouter } from 'next/router';

export default function AlertBoxNonLogged() {
  const router = useRouter();
  return (
    <div className="w-full h-full flex justify-center items-center fixed left-0 top-0 z-30">
      <div className="w-72 h-40 bg-slate-300 flex flex-col">
        <span>
          게스트 유저는 사용할 수 없는 기능입니다. 로그인 창으로 이동합니다.
        </span>
        <button onClick={() => router.push('/')}>확인</button>
      </div>
    </div>
  );
}
