import CreateScheduleModal from '@/components/schedules/today/create-schedule.modal';
import TodayScheduleList from '@/components/schedules/today/today-schedule-list';
import wrapper, {
  RootState,
  initTodaySchedulesReducer,
} from '@/lib/store/store';
import { ALL_SCHEDULES } from '@/utils/graphQL/querys/TodaySkdQuerys';
import request from 'graphql-request';
import { withIronSessionSsr } from 'iron-session/next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  filterMyTodaySchedules,
  filterTodayScheduleIncludeSharingUsers,
} from '../../../utils/methods/filteringMethods';
import removeGraphQLTypename from '@/components/schedules/today/create-schedule.modal/utils/removeGraphQLTypename';

export default function TodayScheduleMain() {
  const [showsCreationTodaySkdModal, setShowsCreationTodaySkdModal] =
    useState(false);
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
      <hr />
      {todaySchedules.length === 0 && <span>오늘의 일정을 등록하세요</span>}
      {todaySchedules.length !== 0 && (
        <TodayScheduleList todaySchedules={todaySchedules} />
      )}
      {showsCreationTodaySkdModal && (
        <CreateScheduleModal
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
      return removeGraphQLTypename(todaySkd);
    });
    const myTodaySkds = filterMyTodaySchedules(allTodaySkds, user);
    const sharedTodaySkds = filterTodayScheduleIncludeSharingUsers(
      allTodaySkds,
      user
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
