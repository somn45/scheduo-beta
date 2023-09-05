import request from 'graphql-request';
import { IUser } from '@/types/interfaces/users.interface';
import { GET_USERS, GET_USER_BY_Id } from '@/utils/graphQL/querys/userQuerys';
import { useSelector } from 'react-redux';
import {
  RootState,
  addFollowerReducer,
  useAppDispatch,
} from '@/lib/store/store';
import Follower from '@/components/Follower';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_FOLLOWER } from '@/utils/graphQL/mutations/usersMutations';
import { buttonClickEvent, inputClickEvent } from '@/types/HTMLEvents';

export default function User({ user }: { user: IUser }) {
  const followers = useSelector((state: RootState) => state.followers);
  const [text, setText] = useState('');
  const [showesFollowModal, setShowesFollowModal] = useState(false);
  const [addFollower] = useMutation(ADD_FOLLOWER, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

  const handleAddFollower = async (e: inputClickEvent) => {
    e.preventDefault();
    const { data: addFollowerQuery, errors } = await addFollower({
      variables: { id: text },
    });
    if (!addFollowerQuery) return;
    const { userId, email, company } = addFollowerQuery.addFollower;
    dispatch(addFollowerReducer({ userId, email, company }));
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
            {followers.map((follower) => (
              <Follower key={follower?.userId} {...follower} />
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
                value="등록"
                onClick={handleAddFollower}
                className="font-semibold absolute right-3 top-1 cursor-pointer"
              />
            </form>
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
  return {
    props: {
      user: getUserData.getUserById,
    },
  };
}
