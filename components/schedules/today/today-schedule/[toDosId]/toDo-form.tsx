import {
  addToDoReducer,
  setErrorMessageReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { ADD_TODO } from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ToDoForm() {
  const [text, setText] = useState('');
  const [addToDo] = useMutation(ADD_TODO, {
    errorPolicy: 'all',
  });
  const { query } = useRouter();
  const dispatch = useAppDispatch();

  const handleAddToDo = async (e: inputClickEvent) => {
    e.preventDefault();
    const toDosId = query.toDosId;
    if (typeof toDosId !== 'string') return;
    const regitDate = Date.now();
    const { data: addToDoQuery, errors } = await addToDo({
      variables: { id: toDosId, content: text, registeredAt: regitDate },
    });
    if (errors) {
      if (errors[0].message === '게스트는 접근할 수 없는 기능입니다.')
        dispatch(setErrorMessageReducer('게스트는 접근할 수 없는 기능입니다.'));
      if (errors[0].message === '권한이 없습니다.')
        dispatch(setErrorMessageReducer('권한이 없습니다.'));
    }
    if (!addToDoQuery) return;
    dispatch(addToDoReducer(addToDoQuery.addToDo));
    setText('');
  };
  return (
    <form className="relative">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="오늘의 일정"
        className="w-72 h-8 px-2 border-2 border-input-color rounded-md 
  outline-none placeholder:text-sm
  hover:border-pink-400 focus:border-pink-400"
      />
      <input
        type="submit"
        value="추가"
        onClick={handleAddToDo}
        className="font-semibold h-8 absolute right-4 cursor-pointer"
      />
    </form>
  );
}
