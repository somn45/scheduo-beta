import {
  deleteFollowerReducer,
  setErrorMessageReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { IFollower } from '@/types/interfaces/users.interface';
import { GRAPHQL_ERROR_MESSAGE_LIST } from '@/utils/constants/constants';
import { DELETE_FOLLOWER } from '@/utils/graphQL/mutations/usersMutations';
import { useMutation } from '@apollo/client';
import React, { useState } from 'react';

export default function MyFollowerItem({
  follower,
  profileUserId,
}: {
  follower: IFollower;
  profileUserId: string;
}) {
  const [deleteFollower] = useMutation(DELETE_FOLLOWER, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

  const handleDeleteFollower = async (e: buttonClickEvent) => {
    e.preventDefault();
    const { data: deleteFollowerResult, errors: deleteFollowerErrors } =
      await deleteFollower({
        variables: { userId: follower.userId, profileUserId },
      });
    if (deleteFollowerErrors) {
      const errorMessage =
        GRAPHQL_ERROR_MESSAGE_LIST[deleteFollowerErrors[0].message];
      dispatch(setErrorMessageReducer(errorMessage));
    }
    dispatch(deleteFollowerReducer(follower));
  };

  return (
    <>
      <li className="h-12">
        <span className="mr-2">{follower.name}</span>
        <button
          onClick={handleDeleteFollower}
          className="px-2 py-1 bg-green-300 rounded-xl hover:text-red-500"
        >
          해제
        </button>
      </li>
    </>
  );
}
