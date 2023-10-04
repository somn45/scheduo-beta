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
import AlertBoxNonLogged from './messageBox/AlertBoxIfNonLogged';

interface FollowerPreviewProps {
  setShowesFollowModal: Dispatch<SetStateAction<boolean>>;
  followers: FollowerSearchItem[];
}

export default function FollowerPreview({
  setShowesFollowModal,
  followers,
}: FollowerPreviewProps) {
  const [text, setText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchItems, setSearchItems] = useState<
    IFollowerPreview[] | undefined
  >(undefined);
  const [showsAlertBox, setShowsAlertBox] = useState(false);
  const dispatch = useAppDispatch();
  const [searchFollowers] = useLazyQuery(SEARCH_FOLLOWERS);
  const [searchFollowersById] = useLazyQuery(SEARCH_FOLLOWERS_BY_ID);
  const [addFollower] = useMutation(ADD_FOLLOWER, {
    errorPolicy: 'all',
  });

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
      const { data } = await searchFollowersById({ variables: { id: text } });
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

  const handleAddFollower = async (e: buttonClickEvent, userId: string) => {
    e.preventDefault();
    const { data, errors } = await addFollower({ variables: { userId } });
    if (errors && errors[0].message === 'User not found')
      return setShowsAlertBox(true);
    if (errors && errors[0].message === 'You cannot follow yourself')
      setErrorMsg('팔로워 대상이 로그인 된 계정입니다.');
    if (errors && errors[0].message === 'Already followed')
      setErrorMsg('이미 팔로우된 사용자입니다.');
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
        <span>{errorMsg}</span>
        <ul className="w-full">
          {searchItems &&
            searchItems.map((user) => (
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
            ))}
        </ul>
      </div>
      {showsAlertBox && <AlertBoxNonLogged />}
    </article>
  );
}
