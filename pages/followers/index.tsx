import Follower from '@/components/Follower';
import { graphql } from '@/generates/type';
import {
  RootState,
  addFollowerReducer,
  initFollowerReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ALL_FOLLOWERS = graphql(`
  query GetFollowers {
    allFollowers {
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
  const { data: followersQuery } = useQuery(ALL_FOLLOWERS);
  const [addFollower] = useMutation(ADD_FOLLOWER, {
    errorPolicy: 'all',
  });
  const followers = useSelector((state: RootState) => state.followers);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!followersQuery) return;
    if (!followersQuery.allFollowers) return;
    dispatch(initFollowerReducer(followersQuery.allFollowers));
  }, [followersQuery]);

  const handleAddFollower = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { data: addFollowerQuery, errors } = await addFollower({
      variables: { id: text },
    });
    if (!addFollowerQuery) return;
    const { userId, email, company } = addFollowerQuery.addFollower;
    dispatch(addFollowerReducer({ userId, email, company }));
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
