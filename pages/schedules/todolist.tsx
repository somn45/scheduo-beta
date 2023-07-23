import { graphql } from '@/generates/type';
import wrapper, {
  RootState,
  addTodaySkdReducer,
  initTodaySchedulesReducer,
} from '@/lib/store/store';
import { useMutation } from '@apollo/client';
import request from 'graphql-request';
import { withIronSessionSsr } from 'iron-session/next';
import Link from 'next/link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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

const CREATE_SCHEDULE = graphql(`
  mutation CreateSchedule($title: String!) {
    createSchedule(title: $title) {
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

export default function ToDoList() {
  const [title, setTitle] = useState('');
  const [createSchedule] = useMutation(CREATE_SCHEDULE);
  const todaySchedules = useSelector(
    (state: RootState) => state.todaySchedules
  );
  const dispatch = useDispatch();

  const handleCreateSchedule = async (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const { data: createScheduleQuery } = await createSchedule({
      variables: { title },
    });
    if (!createScheduleQuery) return;
    dispatch(addTodaySkdReducer(createScheduleQuery.createSchedule));
    setTitle('');
  };

  return (
    <section className="mt-10 bg-main-color flex flex-col">
      <h1 className="mb-5 text-xl font-semibold text-center">오늘의 일정</h1>
      <article className="flex justify-center">
        <form className="mb-12 relative">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="오늘의 일정 제목"
            className="w-96 h-8 px-2 border-2 border-input-color rounded-md 
          outline-none placeholder:text-sm
          hover:border-pink-400 focus:border-pink-400"
          />
          <input
            type="submit"
            value="생성"
            onClick={handleCreateSchedule}
            className="h-6 font-semibold absolute right-2 top-1 cursor-pointer"
          />
        </form>
      </article>
      <p className="w-full mb-4 border border-input-color border-dashed"></p>
      {todaySchedules.length === 0 && <span>오늘의 일정을 등록하세요</span>}
      {todaySchedules.length !== 0 && (
        <article className="px-72 grid gap-4 grid-cols-4">
          {todaySchedules.map((skd) => (
            <Link href={`/schedules/todos/${skd._id}`} key={skd._id}>
              <h4 className="mb-1 text-md font-semibold">{skd.title}</h4>
              <div className="w-48 h-56 py-2 bg-schedule-color border-2 border-input-color rounded-md">
                <ul className="w-full h-full flex flex-col">
                  {skd.toDos.length === 0 && (
                    <div className="flex justify-center items-center">
                      일정 없음
                    </div>
                  )}
                  {skd.toDos.map((toDo) => (
                    <li className="border-b-2 border-slate-800">
                      <div className="pl-2 text-xs text-slate-800">
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
    const allTodaySkds = allTodaySkdQuery.allSchedules.filter(
      (todaySkd) => todaySkd.author === user.id
    );
    store.dispatch(initTodaySchedulesReducer(allTodaySkds));
    return {
      props: {},
    };
  }),
  {
    cookieName: 'uid',
    password: process.env.NEXT_PUBLIC_SESSION_PASSWORD
      ? process.env.NEXT_PUBLIC_SESSION_PASSWORD
      : '',
  }
);
