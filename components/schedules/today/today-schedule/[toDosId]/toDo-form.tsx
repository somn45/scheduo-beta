import useInput from '@/hooks/useInput';
import {
  addToDoReducer,
  setErrorMessageReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { GRAPHQL_ERROR_MESSAGE_LIST } from '@/utils/constants/constants';
import { ADD_TODO } from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function ToDoForm() {
  const [content, setContent, reset] = useInput('');
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
      variables: { id: toDosId, content, registeredAt: regitDate },
    });
    if (errors) {
      return dispatch(
        setErrorMessageReducer(GRAPHQL_ERROR_MESSAGE_LIST[errors[0].message])
      );
    }
    if (!addToDoQuery) return;
    dispatch(addToDoReducer(addToDoQuery.addToDo));
    reset();
  };
  return (
    <form className="relative">
      <input
        type="text"
        value={content}
        onChange={setContent}
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
