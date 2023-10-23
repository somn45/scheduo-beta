import {
  setAlertMessageReducer,
  setErrorMessageReducer,
  updateToDoStateReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { checkboxEvent } from '@/types/HTMLEvents';
import { ITodoWithId } from '@/types/interfaces/todaySkds.interface';
import { UPDATE_TODO_STATE } from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';
import { Dispatch, SetStateAction, useState } from 'react';

interface SetStateCheckboxProps {
  content: string;
  registeredAt: number;
  id: string;
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
}

export default function SetStateCheckbox({
  content,
  registeredAt,
  id,
  checked,
  setChecked,
}: SetStateCheckboxProps) {
  const [updateToDoState] = useMutation(UPDATE_TODO_STATE, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

  const setToDoStateFinish = async (e: checkboxEvent) => {
    if (e.target.checked) {
      const { data: updateToDoStateQuery, errors: updateToDoStateErrors } =
        await updateToDoState({
          variables: { hasFinished: true, id, registeredAt },
        });
      if (updateToDoStateErrors) {
        if (
          updateToDoStateErrors[0].message ===
          '게스트는 접근할 수 없는 기능입니다.'
        )
          return dispatch(
            setErrorMessageReducer('게스트는 접근할 수 없는 기능입니다.')
          );
        if (updateToDoStateErrors[0].message === '권한이 없습니다.')
          return dispatch(setErrorMessageReducer('권한이 없습니다.'));
      }
      if (!updateToDoStateQuery) return;
      setChecked(true);
      dispatch(updateToDoStateReducer(updateToDoStateQuery.updateToDoState));
    } else {
      const { data: updateToDoStateQuery, errors: updateToDoStateErrors } =
        await updateToDoState({
          variables: { hasFinished: false, id, registeredAt },
        });
      if (
        updateToDoStateErrors &&
        updateToDoStateErrors[0].message === 'User not found'
      )
        return dispatch(setAlertMessageReducer('유저 없음'));
      else if (updateToDoStateErrors && updateToDoStateErrors[0].message)
        alert(updateToDoStateErrors[0].message);
      if (!updateToDoStateQuery) return;
      setChecked(false);
      dispatch(updateToDoStateReducer(updateToDoStateQuery.updateToDoState));
    }
  };

  return (
    <>
      <input
        id={content}
        type="checkbox"
        checked={checked}
        onChange={setToDoStateFinish}
        className="w-4 h-4 mr-2 text-blue-900 bg-gray-900 cursor-pointer"
      />
    </>
  );
}
