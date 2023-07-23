import { graphql } from '@/generates/type';
import {
  deleteToDoReducer,
  updateToDoReducer,
  updateToDoStateReducer,
} from '@/lib/store/store';
import { IToDo } from '@/models/TodaySkd';
import { useMutation } from '@apollo/client';
import { getCookie } from 'cookies-next';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

interface ToDoProps extends IToDo {
  id: string;
  checkedList: IToDo[];
  setCheckedList: React.Dispatch<React.SetStateAction<IToDo[]>>;
}

const UPDATE_TODO = graphql(`
  mutation UpdateToDo($id: String!, $content: String!, $registeredAt: Float!) {
    updateToDo(id: $id, content: $content, registeredAt: $registeredAt) {
      content
      registeredAt
    }
  }
`);
const DELETE_TODO = graphql(`
  mutation DeleteToDo($id: String!, $registeredAt: Float!) {
    deleteToDo(id: $id, registeredAt: $registeredAt) {
      content
      registeredAt
      state
    }
  }
`);

const UPDATE_TODO_STATE = graphql(`
  mutation UpdateToDoState(
    $hasFinished: Boolean!
    $id: String!
    $registeredAt: Float!
  ) {
    updateToDoState(
      hasFinished: $hasFinished
      id: $id
      registeredAt: $registeredAt
    ) {
      content
      registeredAt
      state
    }
  }
`);

export default function ToDo({ content, registeredAt, state, id }: ToDoProps) {
  const [text, setText] = useState(content);
  const [checked, setChecked] = useState(state === 'done' ? true : false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [updateToDo] = useMutation(UPDATE_TODO);
  const [deleteToDo] = useMutation(DELETE_TODO);
  const [updateToDoState] = useMutation(UPDATE_TODO_STATE);
  const dispatch = useDispatch();

  const handleUpdateToDo = async (e: React.MouseEvent<HTMLInputElement>) => {
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

  const handleDeleteToDo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { data: deleteToDoQuery } = await deleteToDo({
      variables: { id, registeredAt },
    });
    if (!deleteToDoQuery) return;
    dispatch(deleteToDoReducer(deleteToDoQuery.deleteToDo));
  };

  const setToDoStateFinish = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            <button
              onClick={() => setIsEditMode(false)}
              className="mr-1 text-lg text-slate-500"
            >
              취소
            </button>
            <input
              type="submit"
              value="편집 완료"
              onClick={handleUpdateToDo}
              className="text-lg ease-out duration-150 hover:text-blue-800 cursor-pointer"
            />
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
