import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { graphql } from '@/generates/type';
import Link from 'next/link';
import { getCookie, deleteCookie } from 'cookies-next';

export interface AuthModelFunction {
  showLogin?: () => void;
  showJoin?: () => void;
  closeAuth?: () => void;
}

const GET_USERS = graphql(`
  query GetUsers {
    allUsers {
      userId
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
  const [isLogged, setIsLogged] = useState(false);
  const result = useQuery(GET_USERS);
  const [deleteToken] = useMutation(DELETE_TOKEN);

  useEffect(() => {
    getCookie('uid') ? setIsLogged(true) : setIsLogged(false);
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
        {isLogged ? (
          <button
            onClick={handleLogout}
            className="text-sm font-semibold  ease-out duration-150 hover:text-pink-400"
          >
            로그아웃
          </button>
        ) : (
          <button
            onClick={showLogin}
            className="text-sm font-semibold  ease-out duration-150 hover:text-pink-400"
          >
            로그인/회원가입
          </button>
        )}
      </div>
    </header>
  );
}
