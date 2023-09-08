import Follower from '@/components/Follower';
import wrapper, {
  RootState,
  addFollowerReducer,
  initFollowerReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { ADD_FOLLOWER } from '@/utils/graphQL/mutations/usersMutations';
import { ALL_FOLLOWERS } from '@/utils/graphQL/querys/userQuerys';
import { useMutation } from '@apollo/client';
import request from 'graphql-request';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export default function Followers() {
  const [text, setText] = useState('');
  const followers = useSelector((state: RootState) => state.followers);
  const dispatch = useAppDispatch();

  const handleAddFollower = async (e: inputClickEvent) => {
    e.preventDefault();
    /*
    const { data: addFollowerQuery, errors } = await addFollower({
      variables: { id: text },
    });
    if (!addFollowerQuery) return;
    const { userId, email, company } = addFollowerQuery.addFollower;
    dispatch(addFollowerReducer({ userId, email, company }));
    */
    setText('');
  };

  return (
    <section className="mt-10 flex flex-col items-center">
      <h1 className="mb-5 text-xl font-semibold">팔로우</h1>
      <p className="w-96 h-12 mb-3 px-6 bg-blue-400 rounded-full font-semibold flex justify-center items-center">
        팔로우의 ID를 검색하여 등록할 수 있습니다.
      </p>
      <form className="mb-6 relative">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="팔로우 검색"
          className="w-72 h-8 px-2 border-2 border-input-color rounded-md"
        />
        <input
          type="submit"
          value="등록"
          onClick={handleAddFollower}
          className="font-semibold absolute right-3 top-1 cursor-pointer"
        />
      </form>
      <article className="w-full px-48 grid gap-4 grid-cols-8">
        <ul>
          {followers.map((follower) => (
            <Follower key={follower?.userId} {...follower} />
          ))}
        </ul>
      </article>
    </section>
  );
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(
  wrapper.getServerSideProps((store) => async ({ req }) => {
    const { user } = req.session;
    if (!user)
      return {
        notFound: true,
      };
    const allFollowersQuery = await request(
      'http://localhost:3000/api/graphql',
      ALL_FOLLOWERS,
      { userId: user.id }
    );
    store.dispatch(initFollowerReducer(allFollowersQuery.allFollowers));
    return {
      props: {},
    };
  }),
  {
    cookieName: 'uid',
    password: process.env.SESSION_PASSWORD ? process.env.SESSION_PASSWORD : '',
  }
);
