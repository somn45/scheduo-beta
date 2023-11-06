import MemberListModal from '@/components/schedules/today/today-schedule/[toDosId]/member-list';
import ToDoForm from '@/components/schedules/today/today-schedule/[toDosId]/toDo-form';
import ToDos from '@/components/schedules/today/today-schedule/[toDosId]/toDo-list';
import wrapper, { RootState, initToDosReducer } from '@/lib/store/store';
import {
  TodaySchedule,
  TodaySkdWithFollowers,
} from '@/types/interfaces/todaySkds.interface';
import { FINISH_TODOS } from '@/utils/graphQL/mutations/todaySkdMutations';
import {
  ALL_SCHEDULES,
  GET_SCHEDULE,
} from '@/utils/graphQL/querys/TodaySkdQuerys';
import { useMutation } from '@apollo/client';
import { request } from 'graphql-request';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function TodayScheduleToDos({
  title,
  author,
  sharingUsers,
}: TodaySkdWithFollowers) {
  const [showsMemberList, setShowsMemberList] = useState(false);
  const [finishToDos] = useMutation(FINISH_TODOS);
  const toDos = useSelector((state: RootState) => state.toDos);
  useEffect(() => {
    const handleFinishToDos = async () => {
      await finishToDos({ variables: { title } });
    };
    handleFinishToDos();
  }, []);

  return (
    <section className="mt-10 px-72 font-solmee">
      <article className="w-full h-20 px-10 flex flex-col items-center">
        <div></div>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <span className="text-xl text-slate-600">{`${author}님이 등록함`}</span>
        <button
          onClick={() => setShowsMemberList(true)}
          className="border-2 text-xl"
        >
          멤버 목록
        </button>
      </article>
      <article className="mt-10 flex flex-col items-center">
        <ToDoForm />
        <h5
          className="w-96 h-12 px-16 my-5 
        bg-blue-400 font-sans text-sm font-semibold text-slate-700 rounded-full 
        flex items-center"
        >
          체크박스에 체크 되어있는 일정은 다음 날이 되면 완료 처리가 됩니다.
        </h5>
      </article>
      <ToDos toDos={toDos} />
      {showsMemberList && (
        <MemberListModal
          members={sharingUsers}
          setShowsMemberList={setShowsMemberList}
        />
      )}
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
      const { title, author, sharingUsers, toDos } =
        getTodaySkdQuery.getSchedule;
      store.dispatch(initToDosReducer(toDos));
      return {
        props: { title, author, sharingUsers },
      };
    }
);
