import { graphql } from '@/generates/type';
import { deleteFollowerReducer, useAppDispatch } from '@/lib/store/store';
import { useMutation } from '@apollo/client';
import React from 'react';

export interface FollowerProps {
  userId?: string | null;
  email?: string | null;
  company?: string | null;
}

const DELETE_FOLLOWER = graphql(`
  mutation DeleteFollower($userId: String!) {
    deleteFollower(userId: $userId) {
      userId
      email
      company
    }
  }
`);

export default function Follower({ userId }: FollowerProps) {
  const [deleteFollower] = useMutation(DELETE_FOLLOWER);
  const dispatch = useAppDispatch();

  const handleDeleteFollower = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!userId) return;
    const { data: deleteFollowerQuery, errors } = await deleteFollower({
      variables: { userId },
    });
    console.log(deleteFollowerQuery?.deleteFollower);
    if (!deleteFollowerQuery) return;
    dispatch(deleteFollowerReducer(deleteFollowerQuery.deleteFollower));
  };
  return (
    <>
      <span>{userId}</span>
      <button onClick={handleDeleteFollower}>해제</button>
    </>
  );
}
