import {
  deleteScheduleReducer,
  setAlertMessageReducer,
  setErrorMessageReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { TodayScheduleWithID } from '@/types/interfaces/todaySkds.interface';
import { DELETE_SCHEDULE } from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';

interface TodayScheduleUtilButtonsProps {
  schedule: TodayScheduleWithID;
  setShowsTitleChangeModel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TodayScheduleUtilButtons({
  schedule,
  setShowsTitleChangeModel,
}: TodayScheduleUtilButtonsProps) {
  const [deleteSchedule] = useMutation(DELETE_SCHEDULE, { errorPolicy: 'all' });
  const dispatch = useAppDispatch();

  const handleDeleteTodaySkd = async (e: buttonClickEvent, _id?: string) => {
    e.preventDefault();
    if (!_id) return;
    const { errors } = await deleteSchedule({ variables: { _id } });
    if (errors) {
      if (errors[0].message === '게스트로 접근할 수 없는 기능입니다.')
        return dispatch(
          setErrorMessageReducer('게스트로 접근할 수 없는 기능입니다.')
        );
      if (errors[0].message === '권한이 없습니다.')
        return dispatch(setErrorMessageReducer('권한이 없습니다.'));
      if (errors[0].message === '하루 일정을 찾을 수 없습니다.')
        return dispatch(
          setAlertMessageReducer('하루 일정을 찾을 수 없습니다.')
        );
    }
    dispatch(deleteScheduleReducer({ _id }));
  };

  return (
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
  );
}
