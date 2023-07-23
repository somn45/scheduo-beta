import ToDo from '@/components/ToDo';
import { graphql } from '@/generates/type';
import wrapper, {
  RootState,
  addToDoReducer,
  initToDosReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { DBTodaySkd, IToDo } from '@/models/TodaySkd';
import { useMutation } from '@apollo/client';
import { request } from 'graphql-request';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const ALL_SCHEDULES = graphql(`
  query GetSchedules {
    allSchedules {
      _id
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

const GET_SCHEDULE = graphql(`
  query GetSchedule($id: String!) {
    getSchedule(id: $id) {
      _id
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
  mutation AddToDo($id: String!, $content: String!, $registeredAt: Float!) {
    addToDo(id: $id, content: $content, registeredAt: $registeredAt) {
      content
      registeredAt
      state
    }
  }
`);

export default function ToDos({ title, author }: DBTodaySkd) {
  const [text, setText] = useState('');
  const [checkedList, setCheckedList] = useState<IToDo[]>([]);
  const [addToDo] = useMutation(ADD_TODO, {
    errorPolicy: 'all',
  });
  const { query } = useRouter();
  const toDos = useSelector((state: RootState) => state.toDos);
  const dispatch = useAppDispatch();

  const handleAddToDo = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const toDosId = query.toDosId;
    if (typeof toDosId !== 'string') return;
    const regitDate = Date.now();
    const { data: addToDoQuery } = await addToDo({
      variables: {
        id: toDosId,
        content: text,
        registeredAt: regitDate,
      },
    });
    if (!addToDoQuery) return;
    dispatch(addToDoReducer(addToDoQuery.addToDo));
    setText('');
  };

  return (
    <section className="mt-10 px-72 font-solmee">
      <article className="w-full h-20 px-10 flex flex-col items-center">
        <div></div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <span className="text-xl text-slate-600">{`${author}님이 등록함`}</span>
      </article>
      <article className="flex justify-center">
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
      </article>
      <article className="flex flex-col justify-center items-center">
        <h5
          className="w-96 h-12 px-16 my-5 
        bg-blue-400 font-sans text-sm font-semibold text-slate-700 rounded-full 
        flex items-center"
        >
          체크박스에 체크 되어있는 일정은 다음 날이 되면 완료 처리가 됩니다.
        </h5>
        <ul>
          {!toDos || (toDos.length === 0 && <li>등록된 일정 없음</li>)}
          {toDos.map((toDo) => (
            <ToDo
              key={toDo.registeredAt}
              {...toDo}
              id={typeof query.toDosId === 'string' ? query.toDosId : ''}
              checkedList={checkedList}
              setCheckedList={setCheckedList}
            />
          ))}
        </ul>
      </article>
    </section>
  );
}

export const getStaticPaths = async () => {
  const allTodaySkdQuery = await request(
    'http://localhost:3000/api/graphql',
    ALL_SCHEDULES
  );
  const paths = allTodaySkdQuery.allSchedules.map((todaySkd) => ({
    params: {
      toDosId: todaySkd._id,
    },
  }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ params }) => {
      if (!params || typeof params.toDosId !== 'string')
        return {
          notFound: true,
        };
      const getTodaySkdQuery = await request(
        'http://localhost:3000/api/graphql',
        GET_SCHEDULE,
        { id: params.toDosId }
      );
      const { title, author, toDos } = getTodaySkdQuery.getSchedule;
      store.dispatch(initToDosReducer(toDos));
      return {
        props: { title, author },
      };
    }
);
