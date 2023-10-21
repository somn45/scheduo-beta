import { addFollowerReducer, useAppDispatch } from '@/lib/store/store';
import { buttonClickEvent, inputClickEvent } from '@/types/HTMLEvents';
import {
  IFollowerPreview,
  FollowerSearchItem,
  IFollowers,
} from '@/types/interfaces/users.interface';
import { ADD_FOLLOWER } from '@/utils/graphQL/mutations/usersMutations';
import {
  SEARCH_FOLLOWERS,
  SEARCH_FOLLOWERS_BY_ID,
} from '@/utils/graphQL/querys/userQuerys';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Dispatch, SetStateAction, useState } from 'react';
import ErrorMessageBox from './messageBox/ErrorMessageBox';
import AlertBox from './messageBox/AlertBox';
import SearchedFollowerItem from './SearchedFollowerItem';

interface FollowerPreviewProps {
  setShowesFollowModal: Dispatch<SetStateAction<boolean>>;
  followers: FollowerSearchItem[];
  profileUserId: string;
}

export default function FollowerPreview({
  setShowesFollowModal,
  followers,
  profileUserId,
}: FollowerPreviewProps) {
  const [text, setText] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchItems, setSearchItems] = useState<
    IFollowerPreview[] | undefined
  >(undefined);
  const dispatch = useAppDispatch();
  const [searchFollowers] = useLazyQuery(SEARCH_FOLLOWERS);
  const [searchFollowersById] = useLazyQuery(SEARCH_FOLLOWERS_BY_ID);
  const [addFollower] = useMutation(ADD_FOLLOWER, {
    errorPolicy: 'all',
  });

  const handleAddFollower = async (e: buttonClickEvent, userId: string) => {
    e.preventDefault();
    const { data, errors } = await addFollower({
      variables: { userId, profileUserId },
    });
    if (errors && errors[0].message === '게스트로 접근할 수 없는 기능입니다.')
      return setErrorMsg('게스트는 접근할 수 없는 기능입니다.');
    if (errors && errors[0].message === '권한이 없습니다.')
      return setErrorMsg('권한이 없습니다.');
    if (errors && errors[0].message === '팔로워 대상이 로그인 된 계정입니다.')
      setAlertMsg('팔로워 대상이 로그인 된 계정입니다.');
    if (errors && errors[0].message === '이미 팔로우된 사용자입니다.')
      setAlertMsg('이미 팔로우된 사용자입니다.');
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

  const handleSearchFollowers = async (e: inputClickEvent) => {
    e.preventDefault();
    let searchFollowersResult: FollowerSearchItem[];
    if (text.length >= 3 && text.length <= 5) {
      const { data } = await searchFollowers({ variables: { name: text } });
      if (!data) return;
      searchFollowersResult = data.searchFollowers.map((user) => ({
        userId: user.userId,
        name: user.name,
      }));
    } else {
      const { data } = await searchFollowersById({
        variables: { id: text },
      });
      if (!data) return;
      searchFollowersResult = [data.searchFollowersById];
    }
    const followerIds = followers.map((follower) => follower.userId);
    const followerPreview = searchFollowersResult.map((user) => {
      if (followerIds.includes(user.userId)) return { ...user, follow: true };
      return { ...user, follow: false };
    });
    setSearchItems(followerPreview);
    setText('');
  };

  return (
    <article className="w-full h-screen z-20 fixed left-0 top-0 bg-black/60 flex justify-center items-center">
      <div
        className="w-1/3 h-96 px-10 py-5 rounded-[5px] text-sm bg-slate-50 
flex flex-col items-center relavite"
      >
        <div className="w-full flex justify-end">
          <button
            onClick={() => setShowesFollowModal(false)}
            className="text-xl font-semibold"
          >
            X
          </button>
        </div>
        <p
          className="w-80 h-12 my-3 px-6 bg-blue-400 rounded-full font-semibold 
  flex justify-center items-center"
        >
          팔로우의 ID를 검색하여 등록할 수 있습니다.
        </p>

        <form className="w-80 mb-6 relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="팔로우 검색"
            className="w-80 h-8 px-2 border-2 border-input-color rounded-md"
          />
          <input
            type="submit"
            value="검색"
            onClick={handleSearchFollowers}
            className="font-semibold absolute right-3 top-1 cursor-pointer"
          />
        </form>
        <span>{alertMsg}</span>
        <ul className="w-full">
          {searchItems &&
            searchItems.map((user) => (
              <SearchedFollowerItem
                key={user.userId}
                user={user}
                handleAddFollower={handleAddFollower}
              />
            ))}
        </ul>
      </div>
      {alertMsg && <AlertBox message={alertMsg} setAlertMsg={setAlertMsg} />}
      {errorMsg && <ErrorMessageBox message={errorMsg} />}
    </article>
  );
}
