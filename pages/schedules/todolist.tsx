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
    <section>
      <form>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="오늘의 일정 제목"
        />
        <input type="submit" value="일정 생성" onClick={handleCreateSchedule} />
      </form>
      {todaySchedules.length === 0 && <span>오늘의 일정을 등록하세요</span>}
      {todaySchedules.length !== 0 &&
        todaySchedules.map((skd) => (
          <Link href={`/schedules/todos/${skd._id}`} key={skd._id}>
            <span>{skd.title}</span>
          </Link>
        ))}
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
