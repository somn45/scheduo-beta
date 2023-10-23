import {
  deleteToDoReducer,
  setErrorMessageReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { ITodoWithId } from '@/types/interfaces/todaySkds.interface';
import { DELETE_TODO } from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';

export default function DeleteToDoButton({
  id,
  registeredAt,
}: Omit<ITodoWithId, 'content' | 'state'>) {
  const [deleteToDo] = useMutation(DELETE_TODO, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

  const handleDeleteToDo = async (e: buttonClickEvent) => {
    e.preventDefault();
    const { data: deleteToDoQuery, errors: deleteToDoErrors } =
      await deleteToDo({
        variables: { id, registeredAt },
      });
    if (deleteToDoErrors) {
      if (deleteToDoErrors[0].message === '게스트는 접근할 수 없는 기능입니다.')
        return dispatch(
          setErrorMessageReducer('게스트는 접근할 수 없는 기능입니다.')
        );
      if (deleteToDoErrors[0].message === '권한이 없습니다.')
        return dispatch(setErrorMessageReducer('권한이 없습니다.'));
    }
    if (!deleteToDoQuery) return;
    dispatch(deleteToDoReducer(deleteToDoQuery.deleteToDo));
  };
  return (
    <button
      onClick={handleDeleteToDo}
      className="text-lg text-red-500 
  ease-out duration-150 hover:text-red-700 focus:text-red-700"
    >
      삭제
    </button>
  );
}
