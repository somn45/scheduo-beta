import request from 'graphql-request';
import { FollowerSearchItem, IUser } from '@/types/interfaces/users.interface';
import {
  ALL_FOLLOWERS,
  GET_USERS,
  GET_USER_BY_Id,
  SEARCH_FOLLOWERS,
  SEARCH_FOLLOWERS_BY_ID,
} from '@/utils/graphQL/querys/userQuerys';
import { useSelector } from 'react-redux';
import {
  RootState,
  addFollowerReducer,
  useAppDispatch,
} from '@/lib/store/store';
import Follower from '@/components/Follower';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { ADD_FOLLOWER } from '@/utils/graphQL/mutations/usersMutations';
import { buttonClickEvent, inputClickEvent } from '@/types/HTMLEvents';

interface UserProfileProps {
  user: IUser;
  myFollowers: FollowerSearchItem[];
}

export default function User({ user, myFollowers }: UserProfileProps) {
  const followers = useSelector((state: RootState) => state.followers);
  const [text, setText] = useState('');
  const [searchItems, setSearchItems] = useState<
    FollowerSearchItem[] | undefined
  >(undefined);
  const [showesFollowModal, setShowesFollowModal] = useState(false);
  const [searchFollowers] = useLazyQuery(SEARCH_FOLLOWERS);
  const [searchFollowersById] = useLazyQuery(SEARCH_FOLLOWERS_BY_ID);
  const [addFollower] = useMutation(ADD_FOLLOWER, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

  const handleAddFollower = async (e: buttonClickEvent, userId: string) => {
    e.preventDefault();
    const { data } = await addFollower({ variables: { userId } });
    if (!data) return;
    const { _id, userId: followerId, name, email } = data.addFollower;
    dispatch(
      addFollowerReducer({
        _id: _id ? _id : '',
        userId: followerId,
        name,
        email: email ? email : '',
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
      const { data } = await searchFollowersById({ variables: { id: text } });
      if (!data) return;
      searchFollowersResult = [data.searchFollowersById];
    }
    setSearchItems(searchFollowersResult);
    setText('');
  };

  const closeFollowModal = (e: buttonClickEvent) => {
    e.preventDefault();
    setShowesFollowModal(false);
  };

  return (
    <section className="mt-10 flex">
      <article className="w-1/2 h-80 mb-5 px-3 border-dotted border-r-2 flex flex-col items-center">
        <div className="mb-5 flex flex-col items-center">
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <span className="text-sm text-slate-400">{user._id}</span>
        </div>
        <ul className="w-1/2 flex flex-col">
          <li className="w-full mb-8 flex flex-row justify-between">
            <h5 className="text-lg">아이디 : </h5>
            <span className="text-lgtext-slate-500">{user.userId}</span>
          </li>
          <li className="w-full mb-8 flex flex-row justify-between">
            <h5 className="text-lg">이메일 : </h5>
            <span className="text-lgtext-slate-500">
              {user.email ? user.email : '미등록'}
            </span>
          </li>
          <li className="w-full mb-8 flex flex-row justify-between">
            <h5 className="text-lg">소속 기업 : </h5>
            <span className="text-lgtext-slate-500">
              {user.company ? user.company : '미등록'}
            </span>
          </li>
        </ul>
      </article>
      <article className="w-1/2 flex flex-col items-center">
        <div className="w-full flex justify-between">
          <p className="w-1/3"></p>
          <h3 className="w-1/3 mb-3 text-lg font-semibold text-center">
            팔로워 목록
          </h3>
          <div className="w-1/3 flex justify-center items-center">
            <button
              onClick={() => setShowesFollowModal(true)}
              className="px-2 py-1 border rounded-md hover:bg-slate-200 focus:bg-slate-200"
            >
              팔로워 추가+
            </button>
          </div>
        </div>
        <div className="w-full px-20 grid gap-4 grid-cols-4">
          <ul>
            {myFollowers &&
              myFollowers.map((follower) => (
                <li key={follower.userId}>{follower.name}</li>
              ))}
          </ul>
        </div>
      </article>
      {showesFollowModal && (
        <article className="w-full h-screen z-20 fixed left-0 top-0 bg-black/60 flex justify-center items-center">
          <div
            className="w-1/3 h-96 px-10 py-5 rounded-[5px] text-sm bg-slate-50 
        flex flex-col items-center relavite"
          >
            <div className="w-full flex justify-end">
              <button
                onClick={closeFollowModal}
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
            <ul className="w-full">
              {searchItems &&
                searchItems.map((user) => (
                  <li
                    key={user.userId}
                    className="w-1/4 p-1 border-2 rounded-md flex flex-row justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="mr-2 font-semibold">{user.name}</span>
                      <span className="text-xs text-slate-500">
                        {user.userId}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAddFollower(e, user.userId)}
                      className="px-2 py-1 bg-blue-300 rounded-xl ease-out duration-75 text-white hover:bg-blue-500"
                    >
                      팔로우
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        </article>
      )}
    </section>
  );
}

export async function getStaticPaths() {
  const allUsersData = await request(
    'http://localhost:3000/api/graphql',
    GET_USERS
  );
  const paths = allUsersData.allUsers.map((user) => ({
    params: {
      id: user._id,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const getUserData = await request(
    'http://localhost:3000/api/graphql',
    GET_USER_BY_Id,
    { id: params.id }
  );
  const userId = getUserData.getUserById?.userId;
  if (userId) {
    const allFollowersData = await request(
      'http://localhost:3000/api/graphql',
      ALL_FOLLOWERS,
      { userId }
    );
    return {
      props: {
        user: getUserData.getUserById,
        myFollowers: allFollowersData.allFollowers,
      },
    };
  }
  return {
    props: {
      user: getUserData.getUserById,
    },
  };
}
