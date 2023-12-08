import {
  deleteScheduleReducer,
  setAlertMessageReducer,
  setErrorMessageReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { TodayScheduleWithID } from '@/types/interfaces/todaySkds.interface';
import { GRAPHQL_ERROR_MESSAGE_LIST } from '@/utils/constants/constants';
import { DELETE_SCHEDULE } from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';

interface TodayScheduleUtilButtonsProps {
  schedule: TodayScheduleWithID;
  setShowsManageScheduleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TodayScheduleUtilButtons({
  schedule,
  setShowsManageScheduleModal,
}: TodayScheduleUtilButtonsProps) {
  const [deleteSchedule] = useMutation(DELETE_SCHEDULE, { errorPolicy: 'all' });
  const dispatch = useAppDispatch();

  const handleDeleteTodaySkd = async (e: buttonClickEvent, _id?: string) => {
    e.preventDefault();
    if (!_id) return;
    const { errors: deleteScheduleErrors } = await deleteSchedule({
      variables: { _id },
    });
    if (deleteScheduleErrors) {
      if (deleteScheduleErrors[0].message === '하루 일정을 찾을 수 없습니다.') {
        return dispatch(
          setAlertMessageReducer('하루 일정을 찾을 수 없습니다.')
        );
      }
      return dispatch(
        setErrorMessageReducer(
          GRAPHQL_ERROR_MESSAGE_LIST[deleteScheduleErrors[0].message]
        )
      );
    }
    dispatch(deleteScheduleReducer({ _id }));
  };

  return (
    <ul className="w-schedule-viewer flex justify-between">
      <li>
        <button
          onClick={() => setShowsManageScheduleModal(true)}
          className="px-2 py-1 border-2 border-slate-600 rounded-md
          bg-slate-500 text-xs text-white font-semibold
          hover:bg-slate-800 ease-out duration-500"
        >
          제목 변경
        </button>
      </li>
      <li>
        <button
          onClick={(e) => handleDeleteTodaySkd(e, schedule._id)}
          className="px-2 py-1 border-2 border-slate-600 rounded-md
        bg-red-600 text-xs text-white font-semibold
        hover:bg-red-700 ease-out duration-500"
        >
          삭제
        </button>
      </li>
    </ul>
  );
}
