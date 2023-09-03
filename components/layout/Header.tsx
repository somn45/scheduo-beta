import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { gql } from '@/generates/type';
import { buttonClickEvent } from '@/types/HTMLEvents';

export interface ModelEventList {
  showLogin: () => void;
  showJoin: () => void;
  closeAuth: () => void;
}

export type ModalEventProps = Partial<ModelEventList>;

const GET_USER = gql(`
  query GetUser {
    getUser {
      ...UserListIncludesId
    }
  }
`);

const LOGOUT = gql(`
  mutation Logout {
    logout {
      userId
    }
  }
`);

export default function Header({ showLogin }: ModalEventProps) {
  const { data: geUserQuery } = useQuery(GET_USER);
  const [logOut] = useMutation(LOGOUT);
  const handleLogout = async (e: buttonClickEvent) => {
    e.preventDefault();
    await logOut();
    window.location.reload();
  };

  return (
    <header className="w-full h-10 px-10 py-2 bg-white border-b-2 border-dotted border-b-black fixed flex justify-between">
      <div className="w-1/4 text-sm font-semibold flex justify-between">
        <Link href="/" className=" ease-out duration-150 hover:text-light-pink">
          Scheduo
        </Link>
        <Link
          href="/schedules/todolist"
          className=" ease-out duration-150 hover:text-light-pink"
        >
          오늘의 일정
        </Link>
        <Link
          href="/schedules/weekly"
          className=" ease-out duration-150 hover:text-light-pink"
        >
          주간 일정
        </Link>
        <Link
          href="/schedules/monthly"
          className=" ease-out duration-150 hover:text-light-pink"
        >
          한달 일정
        </Link>
      </div>
      <div>
        {geUserQuery?.getUser.userId ? (
          <>
            <Link
              href="/followers"
              className="text-sm font-semibold ease-out duration-150 hover:text-light-pink"
            >
              팔로워
            </Link>
            <Link
              href={`/users/${geUserQuery?.getUser._id}`}
              className="text-sm font-semibold ease-out duration-150 hover:text-light-pink"
            >
              {geUserQuery?.getUser.userId}
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-semibold ease-out duration-150 hover:text-light-pink"
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            onClick={showLogin}
            className="text-sm font-semibold ease-out duration-150 hover:text-light-pink"
          >
            로그인/회원가입
          </button>
        )}
      </div>
    </header>
  );
}
