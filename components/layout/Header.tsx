import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { graphql } from '@/generates/type';
import { getCookie, deleteCookie } from 'cookies-next';

export interface AuthModelFunction {
  showLogin?: () => void;
  showJoin?: () => void;
  closeAuth?: () => void;
}

const GET_USER = graphql(`
  query GetUser {
    getUser {
      _id
      userId
      email
      company
    }
  }
`);

const DELETE_TOKEN = graphql(`
  mutation DeleteToken($userId: String!) {
    deleteToken(userId: $userId) {
      isSuccess
    }
  }
`);

export default function Header({ showLogin }: AuthModelFunction) {
  const [loggedUser, setLoggedUser] = useState('');
  const { data: getUserData } = useQuery(GET_USER);
  const [deleteToken] = useMutation(DELETE_TOKEN);

  useEffect(() => {
    const userId = getCookie('uid') as string;
    userId ? setLoggedUser(userId) : setLoggedUser('');
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const userId = getCookie('uid');
    if (typeof userId !== 'string') return;
    const { data, errors } = await deleteToken({
      variables: { userId: userId },
    });
    if (data?.deleteToken?.isSuccess) {
      deleteCookie('uid');
      window.location.reload();
    }
  };

  return (
    <header className="w-full h-10 px-10 py-2 fixed flex justify-between">
      <div className="w-1/4 text-sm font-semibold flex justify-between">
        <Link
          href="/schedules/todos"
          className=" ease-out duration-150 hover:text-pink-400"
        >
          오늘의 일정
        </Link>
        <Link
          href="/schedules/weekly"
          className=" ease-out duration-150 hover:text-pink-400"
        >
          주간 일정
        </Link>
        <Link
          href="/schedules/monthly"
          className=" ease-out duration-150 hover:text-pink-400"
        >
          한달 일정
        </Link>
      </div>
      <div>
        {loggedUser ? (
          <>
            <Link
              href={`/users/${getUserData?.getUser?._id}`}
              className="text-sm font-semibold ease-out duration-150 hover:text-pink-400"
            >
              {loggedUser}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold ease-out duration-150 hover:text-pink-400"
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            onClick={showLogin}
            className="text-sm font-semibold ease-out duration-150 hover:text-pink-400"
          >
            로그인/회원가입
          </button>
        )}
      </div>
    </header>
  );
}
