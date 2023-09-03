import { gql } from '@/generates/type';
import { deleteFollowerReducer, useAppDispatch } from '@/lib/store/store';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { publicUserInfo } from '@/types/interfaces/users.interface';
import { useMutation } from '@apollo/client';
import React from 'react';

const DELETE_FOLLOWER = gql(`
  mutation DeleteFollower($userId: String!) {
    deleteFollower(userId: $userId) {
      ...UserList
    }
  }
`);

export default function Follower({ userId }: publicUserInfo) {
  const [deleteFollower] = useMutation(DELETE_FOLLOWER);
  const dispatch = useAppDispatch();

  const handleDeleteFollower = async (e: buttonClickEvent) => {
    e.preventDefault();
    if (!userId) return;
    const { data: deleteFollowerQuery, errors } = await deleteFollower({
      variables: { userId },
    });
    if (!deleteFollowerQuery) return;
    dispatch(deleteFollowerReducer(deleteFollowerQuery.deleteFollower));
  };
  return (
    <li className="h-12">
      <span className="mr-2">{userId}</span>
      <button
        onClick={handleDeleteFollower}
        className="px-2 py-1 bg-green-300 rounded-xl hover:text-red-500"
      >
        해제
      </button>
    </li>
  );
}
