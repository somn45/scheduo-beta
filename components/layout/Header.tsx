import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { gql } from '@/generates/type';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  const [logOut] = useMutation(LOGOUT);

  const handleLogout = async (e: buttonClickEvent) => {
    e.preventDefault();
    await logOut();
    window.location.reload();
  };

  return (
    <header className="w-full h-header px-desktop-white-space pt-[15px] bg-white border-b-2 border-slate-200 fixed">
      <nav className="flex justify-between">
        <ul className="text-sm font-semibold flex justify-between">
          <li className="h-header-nav mr-8">
            <Link
              href="/"
              className="text-2xl font-solmee ease-out duration-150 hover:text-light-pink"
            >
              Scheduo
            </Link>
          </li>
          <li
            className={`mr-8      ${
              router.asPath === '/schedules/todolist' &&
              'border-b-4 border-black'
            }`}
          >
            <Link
              href="/schedules/todolist"
              className="pb-3 text-base ease-out duration-150 
              hover:text-light-pink"
            >
              오늘의 일정
            </Link>
          </li>
          <li
            className={`mr-8 ${
              router.asPath === '/schedules/weekly' && 'border-b-4 border-black'
            }`}
          >
            <Link
              href="/schedules/weekly"
              className="text-base pb-3 ease-out duration-150 hover:text-light-pink"
            >
              주간 일정
            </Link>
          </li>
          <li
            className={`mr-8 ${
              router.asPath === '/schedules/monthly' &&
              'border-b-4 border-black'
            }`}
          >
            <Link
              href="/schedules/monthly"
              className="text-base pb-3 ease-out duration-150 hover:text-light-pink"
            >
              한달 일정
            </Link>
          </li>
        </ul>
        <ul className=" text-sm flex justify-between">
          {geUserQuery?.getUser.userId ? (
            <>
              <li className="mr-8">
                <Link
                  href={`/users/${geUserQuery?.getUser._id}`}
                  className="text-sm pb-3"
                >
                  <span className="p-1 bg-blue-900 border rounded-md text-white ease-out duration-150 hover:bg-white hover:text-blue-900">
                    {geUserQuery?.getUser.userId}
                  </span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-sm pb-3 ease-out duration-150 hover:text-light-pink"
                >
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <button
              onClick={showLogin}
              className="text-sm pb-3 ease-out duration-150 hover:text-light-pink"
            >
              로그인/회원가입
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
}
