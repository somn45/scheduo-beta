import AlertBox from '@/components/messageBox/AlertBox';
import ErrorMessageBox from '@/components/messageBox/ErrorMessageBox';
import CreationTodaySkdModal from '@/components/modal/CreationTodaySkdModal';
import TitleChangeModal from '@/components/modal/TitleChangeModal';
import wrapper, {
  RootState,
  deleteScheduleReducer,
  initTodaySchedulesReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { DELETE_SCHEDULE } from '@/utils/graphQL/mutations/todaySkdMutations';
import { ALL_SCHEDULES } from '@/utils/graphQL/querys/TodaySkdQuerys';
import { useMutation } from '@apollo/client';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import request from 'graphql-request';
import { withIronSessionSsr } from 'iron-session/next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function ToDoList() {
  const [title, setTitle] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showsCreationTodaySkdModal, setShowsCreationTodaySkdModal] =
    useState(false);
  const [showsTitleChangeModel, setShowsTitleChangeModel] = useState(false);
  const [deleteSchedule] = useMutation(DELETE_SCHEDULE, { errorPolicy: 'all' });
  const todaySchedules = useSelector(
    (state: RootState) => state.todaySchedules
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleDeleteTodaySkd = async (e: buttonClickEvent, _id?: string) => {
    e.preventDefault();
    if (!_id) return;
    const { errors } = await deleteSchedule({ variables: { _id } });
    if (errors) {
      if (errors[0].message === '게스트로 접근할 수 없는 기능입니다.')
        return setErrorMsg('게스트로 접근할 수 없는 기능입니다.');
      if (errors[0].message === '권한이 없습니다.')
        setErrorMsg('권한이 없습니다.');
      if (errors[0].message === '하루 일정을 찾을 수 없습니다.')
        setAlertMsg('하루 일정을 찾을 수 없습니다.');
    }
    dispatch(deleteScheduleReducer({ _id }));
  };

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
            <>
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
              <ul>
                <li>
                  <button onClick={() => setShowsTitleChangeModel(true)}>
                    제목 수정
                  </button>
                </li>
                <li>
                  <button onClick={(e) => handleDeleteTodaySkd(e, skd._id)}>
                    스케줄 삭제
                  </button>
                </li>
              </ul>
              {showsTitleChangeModel && (
                <TitleChangeModal
                  todaySkdId={skd._id}
                  title={title}
                  setShowsTitleChangeModel={setShowsTitleChangeModel}
                />
              )}
            </>
          ))}
        </article>
      )}
      {showsCreationTodaySkdModal && (
        <CreationTodaySkdModal
          setShowsCreationTodaySkdModal={setShowsCreationTodaySkdModal}
        />
      )}
      {alertMsg && <AlertBox message={alertMsg} setAlertMsg={setAlertMsg} />}
      {errorMsg && <ErrorMessageBox message={errorMsg} />}
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
