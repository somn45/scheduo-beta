import TodayScheduleItem from '@/components/TodayScheduleItem';
import CreationTodaySkdModal from '@/components/modal/CreationTodaySkdModal';
import wrapper, {
  RootState,
  initTodaySchedulesReducer,
} from '@/lib/store/store';
import { ALL_SCHEDULES } from '@/utils/graphQL/querys/TodaySkdQuerys';
import request from 'graphql-request';
import { withIronSessionSsr } from 'iron-session/next';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function ToDoList() {
  const [showsCreationTodaySkdModal, setShowsCreationTodaySkdModal] =
    useState(false);
  const [showsTitleChangeModel, setShowsTitleChangeModel] = useState(false);
  const todaySchedules = useSelector(
    (state: RootState) => state.todaySchedules
  );

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
          {todaySchedules.map((schedule) => (
            <TodayScheduleItem
              key={schedule._id}
              schedule={schedule}
              showsTitleChangeModel={showsTitleChangeModel}
              setShowsTitleChangeModel={setShowsTitleChangeModel}
            />
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

    const allTodaySkds = allTodaySkdQuery.allSchedules.map((todaySkd) => {
      delete todaySkd.__typename;
      return todaySkd;
    });
    const myTodaySkds = allTodaySkds.filter(
      (todaySkd) => todaySkd.author === user.id
    );
    const sharedTodaySkds = allTodaySkds.filter((todaySkd) =>
      todaySkd.sharingUsers.some(
        (sharingUser) => sharingUser.userId === user.id
      )
    );
    store.dispatch(
      initTodaySchedulesReducer([...myTodaySkds, ...sharedTodaySkds])
    );
    return {
      props: {},
    };
  }),
  {
    cookieName: 'uid',
    password: process.env.SESSION_PASSWORD ? process.env.SESSION_PASSWORD : '',
  }
);
