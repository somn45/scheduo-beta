import {
  deleteToDoReducer,
  updateToDoReducer,
  updateToDoStateReducer,
} from '@/lib/store/store';
import {
  buttonClickEvent,
  checkboxEvent,
  inputClickEvent,
} from '@/types/HTMLEvents';
import { IToDo, ITodoWithId } from '@/types/interfaces/todaySkds.interface';
import {
  DELETE_TODO,
  UPDATE_TODO,
  UPDATE_TODO_STATE,
} from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function ToDo({
  content,
  registeredAt,
  state,
  id,
}: ITodoWithId) {
  const [text, setText] = useState(content);
  const [checked, setChecked] = useState(state === 'willDone' ? true : false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updateToDo] = useMutation(UPDATE_TODO);
  const [deleteToDo] = useMutation(DELETE_TODO);
  const [updateToDoState] = useMutation(UPDATE_TODO_STATE);
  const dispatch = useDispatch();

  const handleUpdateToDo = async (e: inputClickEvent) => {
    e.preventDefault();
    const { data: updateToDoQuery } = await updateToDo({
      variables: { id, content: text, registeredAt },
    });
    if (!updateToDoQuery) return;
    dispatch(
      updateToDoReducer({ ...updateToDoQuery.updateToDo, state: 'toDo' })
    );
    setIsEditMode(false);
  };

  const handleDeleteToDo = async (e: buttonClickEvent) => {
    e.preventDefault();
    const { data: deleteToDoQuery } = await deleteToDo({
      variables: { id, registeredAt },
    });
    if (!deleteToDoQuery) return;
    dispatch(deleteToDoReducer(deleteToDoQuery.deleteToDo));
  };

  const setToDoStateFinish = async (e: checkboxEvent) => {
    if (e.target.checked) {
      setChecked(true);
      const { data: updateToDoStateQuery } = await updateToDoState({
        variables: { hasFinished: true, id, registeredAt },
      });
      if (!updateToDoStateQuery) return;
      dispatch(updateToDoStateReducer(updateToDoStateQuery.updateToDoState));
    } else {
      setChecked(false);
      const { data: updateToDoStateQuery } = await updateToDoState({
        variables: { hasFinished: false, id, registeredAt },
      });
      if (!updateToDoStateQuery) return;
      dispatch(updateToDoStateReducer(updateToDoStateQuery.updateToDoState));
    }
  };

  return (
    <li className="w-96 mb-1 flex justify-between">
      {isEditMode ? (
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
      ) : (
        <>
          <div>
            <input
              id={content}
              type="checkbox"
              checked={checked}
              onChange={setToDoStateFinish}
              className="w-4 h-4 mr-2 text-blue-900 bg-gray-900 cursor-pointer"
            />
            <span
              className={`mr-2 text-2xl underline ${checked && `line-through`}`}
            >
              {content}
            </span>
          </div>
          <div>
            <button
              onClick={() => setIsEditMode(true)}
              className="mr-2 text-lg text-slate-700 
              ease-out duration-150 hover:text-light-pink focus:text-light-pink"
            >
              수정
            </button>
            <button
              onClick={handleDeleteToDo}
              className="text-lg text-red-500 
              ease-out duration-150 hover:text-red-700 focus:text-red-700"
            >
              삭제
            </button>
          </div>
        </>
      )}
    </li>
  );
}
