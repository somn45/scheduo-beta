import {
  addFollowerReducer,
  setAlertMessageReducer,
  setErrorMessageReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { IFollowerPreview } from '@/types/interfaces/users.interface';
import { GRAPHQL_ERROR_MESSAGE_LIST } from '@/utils/constants/constants';
import { ADD_FOLLOWER } from '@/utils/graphQL/mutations/usersMutations';
import { useMutation } from '@apollo/client';

interface SearchedFollowerItemProps {
  user: IFollowerPreview;
  profileUserId: string;
}

export default function SearchedFollowerItem({
  user,
  profileUserId,
}: SearchedFollowerItemProps) {
  const [addFollower] = useMutation(ADD_FOLLOWER, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

  const handleAddFollower = async (e: buttonClickEvent, userId: string) => {
    e.preventDefault();
    const { data, errors } = await addFollower({
      variables: { userId, profileUserId },
    });
    /*
    if (errors && errors[0].message === '게스트로 접근할 수 없는 기능입니다.')
      return dispatch(
        setErrorMessageReducer('게스트는 접근할 수 없는 기능입니다.')
      );
    if (errors && errors[0].message === '권한이 없습니다.')
      return dispatch(setErrorMessageReducer('권한이 없습니다.'));
    if (errors && errors[0].message === '팔로워 대상이 로그인 된 계정입니다.')
      return dispatch(
        setAlertMessageReducer('팔로워 대상이 로그인 된 계정입니다.')
      );
    if (errors && errors[0].message === '이미 팔로우된 사용자입니다.')
      return dispatch(setAlertMessageReducer('이미 팔로우된 사용자입니다.'));
    */
    if (errors) {
      return dispatch(
        setAlertMessageReducer(GRAPHQL_ERROR_MESSAGE_LIST[errors[0].message])
      );
    }
    if (!data) return;
    const { userId: followerId, name, email, company } = data.addFollower;
    dispatch(
      addFollowerReducer({
        userId: followerId,
        name,
        email: email ? email : '',
        company: company ? company : '',
      })
    );
  };

  return (
    <li
      key={user.userId}
      className="w-1/4 p-1 border-2 rounded-md flex flex-row justify-between"
    >
      <div className="flex flex-col">
        <span className="mr-2 font-semibold">{user.name}</span>
        <span className="text-xs text-slate-500">{user.userId}</span>
      </div>
      {user.follow ? (
        <button
          disabled
          className="px-2 py-1 bg-blue-300 rounded-xl ease-out duration-75 text-white"
        >
          팔로우됨
        </button>
      ) : (
        <button
          onClick={(e) => handleAddFollower(e, user.userId)}
          className="px-2 py-1 bg-blue-300 rounded-xl ease-out duration-75 text-white hover:bg-blue-500"
        >
          팔로우
        </button>
      )}
    </li>
  );
}
