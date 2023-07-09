import { graphql } from '@/generates/type';
import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';

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
    }
  }
`);

export default function Followers() {
  const [text, setText] = useState('');
  const { data: followersQuery } = useQuery(ALL_FOLLOWERS);
  const [addFollower] = useMutation(ADD_FOLLOWER, {
    errorPolicy: 'all',
  });
  const handleAddFollower = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { errors } = await addFollower({ variables: { id: text } });
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
      {followersQuery?.allFollowers?.map((follower) => (
        <div key={follower?.userId}>{follower?.userId}</div>
      ))}
    </section>
  );
}
