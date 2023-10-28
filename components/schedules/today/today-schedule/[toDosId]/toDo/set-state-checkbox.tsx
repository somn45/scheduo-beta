import {
  setAlertMessageReducer,
  setErrorMessageReducer,
  updateToDoStateReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { checkboxEvent } from '@/types/HTMLEvents';
import { ITodoWithId } from '@/types/interfaces/todaySkds.interface';
import { GRAPHQL_ERROR_MESSAGE_LIST } from '@/utils/constants/constants';
import { UPDATE_TODO_STATE } from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';
import { GraphQLError } from 'graphql';
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

  const setToDoState = async (e: checkboxEvent) => {
    const updatedstateSchedule = e.target.checked
      ? await setToDoStateWillDone()
      : await setToDoStateToDo();

    if (!updatedstateSchedule) return;
    const { data: updateToDoStateQuery, errors: updateToDoStateErrors } =
      updatedstateSchedule;
    if (updateToDoStateErrors) {
      handleSetStateErrors(updateToDoStateErrors);
    }
    if (!updateToDoStateQuery) return;
    dispatch(updateToDoStateReducer(updateToDoStateQuery.updateToDoState));
  };

  const setToDoStateWillDone = async () => {
    const {
      data: setToDoStateWillDoneQuery,
      errors: setToDoStateWillDoneErrors,
    } = await updateToDoState({
      variables: { hasFinished: true, id, registeredAt },
    });
    setChecked(true);
    return {
      data: setToDoStateWillDoneQuery,
      errors: setToDoStateWillDoneErrors,
    };
  };

  const setToDoStateToDo = async () => {
    const { data: setToDoStateToDoQuery, errors: setToDoStateToDoErrors } =
      await updateToDoState({
        variables: { hasFinished: false, id, registeredAt },
      });
    setChecked(false);
    return { data: setToDoStateToDoQuery, errors: setToDoStateToDoErrors };
  };

  const handleSetStateErrors = (errors: readonly GraphQLError[]) => {
    if (errors[0].message === 'User not found') {
      return dispatch(setAlertMessageReducer('유저 없음'));
    }
    return dispatch(
      setErrorMessageReducer(GRAPHQL_ERROR_MESSAGE_LIST[errors[0].message])
    );
  };

  return (
    <>
      <input
        id={content}
        type="checkbox"
        checked={checked}
        onChange={setToDoState}
        className="w-4 h-4 mr-2 text-blue-900 bg-gray-900 cursor-pointer"
      />
    </>
  );
}
