import {
  deleteToDoReducer,
  setErrorMessageReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { ITodoWithId } from '@/types/interfaces/todaySkds.interface';
import { GRAPHQL_ERROR_MESSAGE_LIST } from '@/utils/constants/constants';
import { DELETE_TODO } from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';

export default function DeleteToDoButton({
  id,
  registeredAt,
}: Omit<ITodoWithId, 'content' | 'updatedAt' | 'state'>) {
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
      dispatch(
        setErrorMessageReducer(
          GRAPHQL_ERROR_MESSAGE_LIST[deleteToDoErrors[0].message]
        )
      );
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
