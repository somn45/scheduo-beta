import CreationTodaySkdModal from '@/components/modal/CreationTodaySkdModal';
import wrapper, {
  RootState,
  addTodaySkdReducer,
  initTodaySchedulesReducer,
} from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { CREATE_SCHEDULE } from '@/utils/graphQL/mutations/todaySkdMutations';
import { ALL_SCHEDULES } from '@/utils/graphQL/querys/TodaySkdQuerys';
import { useMutation } from '@apollo/client';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import request from 'graphql-request';
import { withIronSessionSsr } from 'iron-session/next';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ToDoList() {
  const [title, setTitle] = useState('');
  const [showsCreationTodaySkdModal, setShowsCreationTodaySkdModal] =
    useState(false);
  const [createSchedule] = useMutation(CREATE_SCHEDULE);
  const todaySchedules = useSelector(
    (state: RootState) => state.todaySchedules
  );
  const dispatch = useDispatch();

  return (
    <section className="mt-10 flex flex-col relative">
      <h1 className="mb-5 text-xl font-semibold text-center">오늘의 일정</h1>
      <button
        onClick={() => setShowsCreationTodaySkdModal(true)}
        className="mb-10"
      >
        일정 생성
      </button>
      <p className="w-screen border border-input-color border-dashed fixed left-0 top-44"></p>
      {todaySchedules.length === 0 && <span>오늘의 일정을 등록하세요</span>}
      {todaySchedules.length !== 0 && (
        <article className="w-full h-full px-72 pt-[15px] grid gap-4 grid-cols-4">
          {todaySchedules.map((skd) => (
            <Link href={`/schedules/todos/${skd._id}`} key={skd._id}>
              <div className="w-40 h-44 py-2 bg-schedule-color border-2 border-schedule-board-color rounded-md">
                <ul className="w-full h-full flex flex-col relative">
                  <FontAwesomeIcon
                    icon={faClipboard}
                    className="opacity-75 text-xl absolute top-[-15px] left-[-5px]"
                  />
                  <h4 className="mb-1 pb-2 border-b-2 border-schedule-board-color text-md font-semibold text-center">
                    {skd.title}
                  </h4>
                  {skd.toDos.length === 0 && (
                    <div className="w-full h-full flex justify-center items-center">
                      일정 없음
                    </div>
                  )}
                  {skd.toDos.map((toDo) => (
                    <li
                      key={toDo.content}
                      className="border-b-2 border-schedule-content-color"
                    >
                      <div className="pl-2 text-xs text-slate-800 before:content-['o'] before:mr-1">
                        {toDo.content}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </article>
      )}
      {showsCreationTodaySkdModal && (
        <CreationTodaySkdModal
          setShowsCreationTodaySkdModal={setShowsCreationTodaySkdModal}
        />
      )}
    </section>
  );
}

export const getServerSideProps = withIronSessionSsr(
  wrapper.getServerSideProps((store) => async ({ req }) => {
    const allTodaySkdQuery = await request(
      'http://localhost:3000/api/graphql',
      ALL_SCHEDULES
    );
    const { user } = req.session;
    if (!user)
      return {
        props: {},
      };
    const allTodaySkds = allTodaySkdQuery.allSchedules
      .filter((todaySkd) => todaySkd.author === user.id)
      .map((todaySkd) => {
        delete todaySkd.__typename;
        return todaySkd;
      });
    store.dispatch(initTodaySchedulesReducer(allTodaySkds));
    return {
      props: {},
    };
  }),
  {
    cookieName: 'uid',
    password: process.env.SESSION_PASSWORD ? process.env.SESSION_PASSWORD : '',
  }
);
