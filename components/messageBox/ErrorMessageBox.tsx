import { useRouter } from 'next/router';

interface ErrorMessageBoxProps {
  message: string;
}

export default function ErrorMessageBox({ message }: ErrorMessageBoxProps) {
  const router = useRouter();
  return (
    <div className="w-full h-full flex justify-center items-center fixed left-0 top-0 z-30">
      <div className="w-72 h-40 bg-slate-300 flex flex-col">
        <span>{message} 홈 페이지로 이동합니다.</span>
        <button onClick={() => router.push('/')}>확인</button>
      </div>
    </div>
  );
}
