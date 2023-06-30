import { graphql } from '@/generates/type';
import { RootState } from '@/lib/store/store';
import { IToDo } from '@/pages/schedules/todos';
import { convertNumberToDate } from '@/utils/convertDate';
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const UPDATE_TODO = graphql(`
  mutation UpdateToDo(
    $content: String!
    $registrant: String!
    $registeredAt: Float!
  ) {
    updateToDo(
      content: $content
      registrant: $registrant
      registeredAt: $registeredAt
    ) {
      content
      registrant
      registeredAt
    }
  }
`);
const DELETE_TODO = graphql(`
  mutation DeleteToDo($registrant: String!, $registeredAt: Float!) {
    deleteToDo(registrant: $registrant, registeredAt: $registeredAt) {
      registrant
      registeredAt
    }
  }
`);

export default function ToDo({
  content,
  registrant,
  registeredAt,
  state,
}: IToDo) {
  const [toDo, setToDo] = useState({
    content,
    registrant,
    registeredAt,
    state,
  });
  const [text, setText] = useState(content);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasDeleted, setHasDeleted] = useState(false);
  const [updateToDo] = useMutation(UPDATE_TODO);
  const [deleteToDo] = useMutation(DELETE_TODO);
  const dispatch = useDispatch();

  const handleUpdateToDo = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    await updateToDo({
      variables: { content: text, registrant, registeredAt },
    });
    setIsEditMode(false);
    setToDo({ ...toDo, content: text });
  };

  const handleDeleteToDo = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await deleteToDo({
      variables: { registrant, registeredAt },
    });
    setHasDeleted(true);
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
            <span>{toDo.content}</span>
            <button onClick={() => setIsEditMode(true)}>수정</button>
          </>
        )}
        <button onClick={handleDeleteToDo}>삭제</button>
      </li>
    )
  );
}
