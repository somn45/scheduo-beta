import { Dispatch, SetStateAction } from 'react';

export default function UpdateToDoButton({
  setIsEditMode,
}: {
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <button
      onClick={() => setIsEditMode(true)}
      className="mr-2 text-lg text-slate-700 
  ease-out duration-150 hover:text-light-pink focus:text-light-pink"
    >
      수정
    </button>
  );
}
