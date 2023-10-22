import FinishToDos from '@/components/FinishedToDo';
import ToDo from '@/components/ToDo';
import ErrorMessageBox from '@/components/messageBox/ErrorMessageBox';
import AlertBoxNonLogged from '@/components/messageBox/ErrorMessageBox';
import wrapper, {
  RootState,
  addToDoReducer,
  initToDosReducer,
  setErrorMessageReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { IToDo, TodaySchedule } from '@/types/interfaces/todaySkds.interface';
import {
  ADD_TODO,
  FINISH_TODOS,
} from '@/utils/graphQL/mutations/todaySkdMutations';
import {
  ALL_SCHEDULES,
  GET_SCHEDULE,
} from '@/utils/graphQL/querys/TodaySkdQuerys';
import { useMutation } from '@apollo/client';
import { request } from 'graphql-request';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ToDos({ title, author }: TodaySchedule) {
  const [text, setText] = useState('');
  const [addToDo] = useMutation(ADD_TODO, {
    errorPolicy: 'all',
  });
  const [finishToDos] = useMutation(FINISH_TODOS);
  const { query } = useRouter();
  const toDos = useSelector((state: RootState) => state.toDos);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleFinishToDos = async () => {
      await finishToDos({ variables: { title } });
    };
    handleFinishToDos();
  }, []);

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
    <section className="mt-10 px-72 font-solmee">
      <article className="w-full h-20 px-10 flex flex-col items-center">
        <div></div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <span className="text-xl text-slate-600">{`${author}님이 등록함`}</span>
      </article>
      <article className="flex flex-col items-center">
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
        <h5
          className="w-96 h-12 px-16 my-5 
        bg-blue-400 font-sans text-sm font-semibold text-slate-700 rounded-full 
        flex items-center"
        >
          체크박스에 체크 되어있는 일정은 다음 날이 되면 완료 처리가 됩니다.
        </h5>
      </article>

      <article className="flex justify-cneter">
        <ul className="w-1/2 flex flex-col justify-cneter items-center">
          <h5 className="mb-3">등록된 일정</h5>
          {!toDos ||
            (toDos.length === 0 && (
              <li className="text-center">등록된 일정 없음</li>
            ))}
          {toDos
            .filter((toDo) => toDo.state !== 'done')
            .map((toDo) => (
              <ToDo
                key={toDo.content}
                {...toDo}
                id={typeof query.toDosId === 'string' ? query.toDosId : ''}
              />
            ))}
        </ul>
        <ul className="w-1/2 h-80 bg-slate-200 rounded-md flex flex-col justify-cneter items-center">
          <h5 className="mb-3">완료된 일정</h5>
          {!toDos ||
            (toDos.length === 0 && (
              <li className="text-center">완료된 일정 없음</li>
            ))}
          {toDos
            .filter((toDo) => toDo.state === 'done')
            .map((toDo) => (
              <FinishToDos key={toDo.content} {...toDo} />
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
