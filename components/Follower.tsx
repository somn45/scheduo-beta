import { gql } from '@/generates/type';
import { deleteFollowerReducer, useAppDispatch } from '@/lib/store/store';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { IFollowers } from '@/types/interfaces/users.interface';
import { DELETE_FOLLOWER } from '@/utils/graphQL/mutations/usersMutations';
import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import ErrorMessageBox from './messageBox/ErrorMessageBox';

export default function Follower({
  follower,
  profileUserId,
}: {
  follower: IFollowers;
  profileUserId: string;
}) {
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteFollower] = useMutation(DELETE_FOLLOWER, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

  const handleDeleteFollower = async (e: buttonClickEvent) => {
    e.preventDefault();
    const { data, errors } = await deleteFollower({
      variables: { userId: follower.userId, profileUserId },
    });
    if (errors && errors[0].message === '게스트로 접근할 수 없는 기능입니다.')
      return setErrorMsg('게스트로 접근할 수 없는 기능입니다.');
    else if (errors && errors[0].message === '권한이 없습니다.')
      return setErrorMsg('권한이 없습니다.');
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
      {errorMsg && <ErrorMessageBox message={errorMsg} />}
    </>
  );
}
