import {
  setErrorMessageReducer,
  updateToDoReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { ITodoWithId } from '@/types/interfaces/todaySkds.interface';
import { UPDATE_TODO } from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';
import { Dispatch, SetStateAction, useState } from 'react';

interface EditToDoProps {
  content: string;
  registeredAt: number;
  id: string;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
}

export default function EditToDo({
  content,
  registeredAt,
  id,
  setIsEditMode,
}: EditToDoProps) {
  const [text, setText] = useState(content);
  const [updateToDo] = useMutation(UPDATE_TODO, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

  const handleUpdateToDo = async (e: inputClickEvent) => {
    e.preventDefault();
    const { data: updateToDoQuery, errors } = await updateToDo({
      variables: { id, content: text, registeredAt },
    });
    if (errors) {
      if (errors[0].message === '게스트는 접근할 수 없는 기능입니다.')
        return dispatch(
          setErrorMessageReducer('게스트는 접근할 수 없는 기능입니다.')
        );
      if (errors[0].message === '권한이 없습니다.')
        return dispatch(setErrorMessageReducer('권한이 없습니다.'));
    }
    if (!updateToDoQuery) return;
    dispatch(
      updateToDoReducer({ ...updateToDoQuery.updateToDo, state: 'toDo' })
    );
    setIsEditMode(false);
  };

  return (
    <form className="w-full flex justify-between">
      <div>
        <input type="checkbox" className="mr-2 opacity-0" />
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="오늘의 일정"
          className="bg-main-color border-b-2 border-black outline-none rouneded-md text-2xl hover:border-blue-700 focus:border-blue-700"
        />
      </div>
      <div>
        <input
          type="submit"
          value="편집 완료"
          onClick={handleUpdateToDo}
          className="text-lg ease-out duration-150 hover:text-blue-800 cursor-pointer"
        />
        <button
          onClick={() => setIsEditMode(false)}
          className="mr-1 text-lg text-slate-500"
        >
          취소
        </button>
      </div>
    </form>
  );
}
