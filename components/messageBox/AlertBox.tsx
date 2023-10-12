import { useRouter } from 'next/router';
import { SetStateAction } from 'react';

interface AlertBoxProps {
  message: string;
  setAlertMsg: React.Dispatch<SetStateAction<string>>;
}

export default function AlertBox({ message, setAlertMsg }: AlertBoxProps) {
  return (
    <div className="w-full h-full flex justify-center items-center fixed left-0 top-0 z-30">
      <div className="w-72 h-40 bg-slate-300 flex flex-col">
        <span>{message}</span>
        <button onClick={() => setAlertMsg('')}>확인</button>
      </div>
    </div>
  );
}
