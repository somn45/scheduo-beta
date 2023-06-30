import React, { useEffect, useState } from 'react';
import { graphql } from '@/generates/type';
import { useMutation } from '@apollo/client';
import { getCookie } from 'cookies-next';
import request, { gql } from 'graphql-request';
import ToDo from '@/components/ToDo';
import { useSelector } from 'react-redux';
import wrapper, {
  RootState,
  addToDoReducer,
  initToDoReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { GetServerSideProps } from 'next';
import { Context } from 'next-redux-wrapper';

export interface IToDo {
  id?: string;
  content: string;
  registrant: string;
  registeredAt: number;
  state: string;
}

interface ToDosProps {
  getToDos: IToDo[];
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

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async (context: Context) => {
    const response = await request<ToDosProps>(
      'http://localhost:3000/api/graphql',
      GET_TODOS
    );
    store.dispatch(initToDoReducer(response.getToDos));
    return {
      props: {},
    };
  });

export default function ToDos() {
  const [text, setText] = useState('');
  const [addToDo] = useMutation(ADD_TODO);
  const { toDos } = useSelector((state: RootState) => state);
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log(toDos);
  }, [toDos]);

  const printToDo = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const userId = getCookie('uid');
    if (!userId || typeof userId !== 'string') return;
    const regitDate = Date.now();
    await addToDo({
      variables: {
        content: text,
        registrant: userId,
        registeredAt: regitDate,
        state: 'toDo',
      },
    });
    dispatch(
      addToDoReducer({
        content: text,
        registrant: userId,
        registeredAt: regitDate,
        state: 'toDo',
      })
    );
    setText('');
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
      {toDos && (
        <ul>
          {toDos.map((toDo) => (
            <ToDo key={toDo.registeredAt} {...toDo} />
          ))}
        </ul>
      )}
      {!toDos && <span>오늘의 일정을 등록하세요</span>}
    </section>
  );
}
