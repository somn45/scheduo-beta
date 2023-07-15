import ToDo from '@/components/ToDo';
import { graphql } from '@/generates/type';
import { useMutation, useQuery } from '@apollo/client';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

export interface IToDo {
  id?: string;
  content: string;
  registeredAt: number;
  state: string;
}

interface ToDosProps {
  getToDos: IToDo[];
}

const GET_SCHEDULE = graphql(`
  query GetSchedule($id: String!) {
    getSchedule(id: $id) {
      title
      author
      toDos {
        content
        registeredAt
        state
      }
    }
  }
`);

const ADD_TODO = graphql(`
  mutation AddToDo($content: String!, $registeredAt: Float!) {
    addToDo(content: $content, registeredAt: $registeredAt) {
      content
      registeredAt
      state
    }
  }
`);

export default function ToDos() {
  const [text, setText] = useState('');
  const { query } = useRouter();
  const { data: getScheduleQuery } = useQuery(GET_SCHEDULE, {
    variables: { id: typeof query.toDosId === 'string' ? query.toDosId : '' },
  });
  const [addToDo] = useMutation(ADD_TODO, {
    errorPolicy: 'all',
  });

  const handleAddToDo = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const author = getCookie('uid');
    if (!author || typeof author !== 'string') return;
    const regitDate = Date.now();
    const { data: addToDoQuery } = await addToDo({
      variables: {
        content: text,
        registeredAt: regitDate,
      },
    });
  };

  return (
    <div>
      <form>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="오늘의 일정"
        />
        <input type="submit" value="일정 추가" onClick={handleAddToDo} />
      </form>
      <ul>
        {!getScheduleQuery?.getSchedule.toDos ||
          (getScheduleQuery.getSchedule.toDos.length === 0 && (
            <li>등록된 일정 없음</li>
          ))}
        {getScheduleQuery?.getSchedule.toDos.map(
          (toDo) =>
            toDo && (
              <ToDo
                key={toDo.registeredAt}
                {...toDo}
                id={typeof query.toDosId === 'string' ? query.toDosId : ''}
              />
            )
        )}
      </ul>
    </div>
  );
}
