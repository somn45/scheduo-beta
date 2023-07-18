import Follower, { FollowerProps } from '@/components/Follower';
import { graphql } from '@/generates/type';
import wrapper, {
  RootState,
  addFollowerReducer,
  initFollowerReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { useMutation, useQuery } from '@apollo/client';
import request from 'graphql-request';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ALL_FOLLOWERS = graphql(`
  query GetFollowers($userId: String!) {
    allFollowers(userId: $userId) {
      userId
    }
  }
`);

const ADD_FOLLOWER = graphql(`
  mutation AddFollower($id: String!) {
    addFollower(id: $id) {
      _id
      userId
      email
      company
    }
  }
`);

export default function Followers() {
  const [text, setText] = useState('');
  const [addFollower] = useMutation(ADD_FOLLOWER, {
    errorPolicy: 'all',
  });
  const followers = useSelector((state: RootState) => state.followers);
  const dispatch = useAppDispatch();

  const handleAddFollower = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { data: addFollowerQuery, errors } = await addFollower({
      variables: { id: text },
    });
    if (!addFollowerQuery) return;
    const { userId, email, company } = addFollowerQuery.addFollower;
    dispatch(addFollowerReducer({ userId, email, company }));
    setText('');
  };

  return (
    <section>
      <form>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="팔로우 검색"
        />
        <input type="submit" value="팔로우 등록" onClick={handleAddFollower} />
      </form>
      <ul>
        {followers.map((follower) => (
          <li key={follower?.userId}>
            <Follower {...follower} />
          </li>
        ))}
      </ul>
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
    password: process.env.NEXT_PUBLIC_SESSION_PASSWORD
      ? process.env.NEXT_PUBLIC_SESSION_PASSWORD
      : '',
  }
);
