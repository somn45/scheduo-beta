import { gql } from '@/generates/type';
import { deleteFollowerReducer, useAppDispatch } from '@/lib/store/store';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { IFollowers, publicUserInfo } from '@/types/interfaces/users.interface';
import { DELETE_FOLLOWER } from '@/utils/graphQL/mutations/usersMutations';
import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import AlertBoxNonLogged from './messageBox/AlertBoxIfNonLogged';

export default function Follower({ follower }: { follower: IFollowers }) {
  const [showsAlertBox, setShowsAlertBox] = useState(false);
  const [deleteFollower] = useMutation(DELETE_FOLLOWER, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

  const handleDeleteFollower = async (e: buttonClickEvent) => {
    e.preventDefault();
    const { data, errors } = await deleteFollower({
      variables: { userId: follower.userId },
    });
    if (errors && errors[0].message === 'User not found')
      return setShowsAlertBox(true);
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
      {showsAlertBox && <AlertBoxNonLogged />}
    </>
  );
}
