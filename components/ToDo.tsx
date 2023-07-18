import { graphql } from '@/generates/type';
import { deleteToDoReducer, updateToDoReducer } from '@/lib/store/store';
import { IToDo } from '@/models/TodaySkd';
import { useMutation } from '@apollo/client';
import { getCookie } from 'cookies-next';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

interface ToDoProps extends IToDo {
  id: string;
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

export default function ToDo({ content, registeredAt, state, id }: ToDoProps) {
  const [text, setText] = useState(content);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);
  const [updateToDo] = useMutation(UPDATE_TODO);
  const [deleteToDo] = useMutation(DELETE_TODO);
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
  return (
    !hasDeleted && (
      <li>
        {isEditMode ? (
          <form>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="오늘의 할일"
            />
            <button onClick={() => setIsEditMode(false)}>취소</button>
            <input type="submit" value="편집 완료" onClick={handleUpdateToDo} />
          </form>
        ) : (
          <>
            <span>{content}</span>
            <button onClick={() => setIsEditMode(true)}>수정</button>
          </>
        )}
        <button onClick={handleDeleteToDo}>삭제</button>
      </li>
    )
  );
}
