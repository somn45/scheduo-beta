import {
  addFollowerReducer,
  setAlertMessageReducer,
  setErrorMessageReducer,
  useAppDispatch,
} from '@/lib/store/store';
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
import SearchedFollowerItem from './search-follower-item';
import SearchFollowerForm from './search-follower-form';

interface FollowerPreviewProps {
  setShowsFollowModal: Dispatch<SetStateAction<boolean>>;
  followers: FollowerSearchItem[];
  profileUserId: string;
}

export default function SearchFollowerModel({
  setShowsFollowModal,
  followers,
  profileUserId,
}: FollowerPreviewProps) {
  const [text, setText] = useState('');
  const [searchItems, setSearchItems] = useState<
    IFollowerPreview[] | undefined
  >(undefined);
  const [searchFollowers] = useLazyQuery(SEARCH_FOLLOWERS);
  const [searchFollowersById] = useLazyQuery(SEARCH_FOLLOWERS_BY_ID);

  const handleSearchFollowers = async (e: inputClickEvent) => {
    e.preventDefault();
    let searchFollowersResult: FollowerSearchItem[];
    console.log(text);
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
            onClick={() => setShowsFollowModal(false)}
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

        <SearchFollowerForm
          text={text}
          setText={setText}
          handleSearchFollowers={handleSearchFollowers}
        />
        <ul className="w-full">
          {searchItems &&
            searchItems.map((user) => (
              <SearchedFollowerItem
                key={user.userId}
                user={user}
                profileUserId={profileUserId}
              />
            ))}
        </ul>
      </div>
    </article>
  );
}
