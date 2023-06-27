import React, { useEffect, useState } from 'react';
import { graphql } from '@/generates/type';
import { useMutation } from '@apollo/client';
import { getCookie } from 'cookies-next';
import request, { gql } from 'graphql-request';

export interface ToDo {
  content: string;
  registrant: string;
  registeredAt: number;
  state: string;
}

interface ToDosProps {
  toDos: ToDo[];
}

interface GetToDosResponse {
  getToDos: ToDo[];
}

const ADD_TODO = graphql(`
  mutation AddToDo(
    $content: String!
    $registrant: String!
    $registeredAt: Float!
    $state: String!
  ) {
    addToDo(
      content: $content
      registrant: $registrant
      registeredAt: $registeredAt
      state: $state
    ) {
      content
      registrant
      registeredAt
      state
    }
  }
`);

const GET_TODOS = gql`
  query GetToDos {
    getToDos {
      content
      registrant
      registeredAt
      state
    }
  }
`;

export async function getStaticProps() {
  const { getToDos } = await request<GetToDosResponse>(
    'http://localhost:3000/api/graphql',
    GET_TODOS
  );
  return {
    props: {
      toDos: getToDos,
    },
  };
}

export default function ToDos({ toDos }: ToDosProps) {
  const [text, setText] = useState('');
  const [printedToDos, setPrintedToDos] = useState<ToDo[]>([]);
  const [addToDo] = useMutation(ADD_TODO);
  useEffect(() => {
    setPrintedToDos(toDos);
  }, [toDos]);

  const printToDo = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const userId = getCookie('uid');
    if (!userId || typeof userId !== 'string') return;
    const { data, errors } = await addToDo({
      variables: {
        content: text,
        registrant: userId,
        registeredAt: Date.now(),
        state: 'toDo',
      },
    });
    setPrintedToDos([
      ...printedToDos,
      {
        content: text,
        registrant: userId,
        registeredAt: Date.now(),
        state: 'toDo',
      },
    ]);
  };

  return (
    <section>
      <form>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="오늘의 할일"
        />
        <input type="submit" value="등록" onClick={printToDo} />
      </form>
      <ul>
        {printedToDos.map((toDo) => (
          <li key={toDo.registeredAt}>{toDo.content}</li>
        ))}
      </ul>
    </section>
  );
}
