import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { TodayScheduleWithID } from '@/types/interfaces/todaySkds.interface';
import TitleChangeModal from './modal/TitleChangeModal';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { deleteScheduleReducer, useAppDispatch } from '@/lib/store/store';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_SCHEDULE } from '@/utils/graphQL/mutations/todaySkdMutations';
import AlertBox from './messageBox/AlertBox';
import ErrorMessageBox from './messageBox/ErrorMessageBox';
import ToDoPreview from './layout/list/ToDoPreview';

interface TodayScheduleProps {
  schedule: TodayScheduleWithID;
  showsTitleChangeModel: boolean;
  setShowsTitleChangeModel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TodayScheduleItem({
  schedule,
  showsTitleChangeModel,
  setShowsTitleChangeModel,
}: TodayScheduleProps) {
  const [alertMsg, setAlertMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteSchedule] = useMutation(DELETE_SCHEDULE, { errorPolicy: 'all' });
  const dispatch = useAppDispatch();

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
    <>
      <Link href={`/schedules/todos/${schedule._id}`} key={schedule._id}>
        <div className="w-40 h-44 py-2 bg-schedule-color border-2 border-schedule-board-color rounded-md">
          <ul className="w-full h-full flex flex-col relative">
            <FontAwesomeIcon
              icon={faClipboard}
              className="opacity-75 text-xl absolute top-[-15px] left-[-5px]"
            />
            <h4 className="mb-1 pb-2 border-b-2 border-schedule-board-color text-md font-semibold text-center">
              {schedule.title}
            </h4>
            {schedule.toDos.length === 0 && (
              <div className="w-full h-full flex justify-center items-center">
                일정 없음
              </div>
            )}
            {schedule.toDos.map((toDo) => (
              <ToDoPreview key={toDo.content} toDo={toDo} />
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
          <button onClick={(e) => handleDeleteTodaySkd(e, schedule._id)}>
            스케줄 삭제
          </button>
        </li>
      </ul>
      {showsTitleChangeModel && (
        <TitleChangeModal
          todaySkdId={schedule._id}
          title={''}
          setShowsTitleChangeModel={setShowsTitleChangeModel}
        />
      )}
      {alertMsg && <AlertBox message={alertMsg} setAlertMsg={setAlertMsg} />}
      {errorMsg && <ErrorMessageBox message={errorMsg} />}
    </>
  );
}
