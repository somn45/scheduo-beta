import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Link from 'next/link';
import { gql } from '@/generates/type';
import { buttonClickEvent } from '@/types/HTMLEvents';
import { useRouter } from 'next/router';
import AlertBox from '../common/messageBox/AlertBox';
import NavItem from '../common/list-item/nav-item';
import Title from './Title';

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

export default function Header() {
  const [showsAlertBox, setShowsAlertBox] = useState(false);
  const { data: getUserQuery } = useQuery(GET_USER);
  const [logOut] = useMutation(LOGOUT);
  const router = useRouter();

  const handleLogout = async (e: buttonClickEvent) => {
    e.preventDefault();
    const { errors: logoutErrors } = await logOut();
    if (
      logoutErrors &&
      logoutErrors[0].message === '이미 로그아웃 된 사용자입니다.'
    )
      return setShowsAlertBox(true);
    router.reload();
  };

  return (
    <header
      className="w-screen h-header
    bg-white border-b-2 border-slate-200 fixed top-0 left-0 z-30"
    >
      <nav
        className="w-full h-header 
      px-mobile-white-space md:px-tablet-white-space xl:px-desktop-white-space 
      flex justify-end sm:justify-between"
      >
        <ul
          className="w-2/3 text-sm font-semibold 
        hidden sm:flex justify-start"
        >
          <Title />
          <NavItem linkHref="/schedules/today" text="오늘의 일정" />
          <NavItem linkHref="/schedules/weekly" text="주간 일정" />
          <NavItem linkHref="/schedules/monthly" text="한달 일정" />
        </ul>
        <ul className="w-1/2 sm:w-1/3 md:pr-2 lg:pr-5 text-sm flex justify-end">
          {getUserQuery !== undefined && getUserQuery.getUser !== null ? (
            <>
              <li className="h-header pt-3 mr-8 flex justfiy-center items-center">
                <Link
                  href={`/users/${getUserQuery.getUser._id}`}
                  className="text-sm pb-3"
                >
                  <span className="p-1 bg-blue-900 border rounded-md text-white ease-out duration-150 hover:bg-white hover:text-blue-900">
                    {getUserQuery.getUser.userId}
                  </span>
                </Link>
              </li>
              <li className='"h-header pt-3 flex justfiy-center items-center'>
                <button
                  onClick={handleLogout}
                  className="text-sm pb-3 ease-out duration-150 hover:text-light-pink"
                >
                  로그아웃
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="h-header pt-3 mr-8 flex justfiy-center items-center">
                <Link
                  href="/login"
                  className="text-sm pb-3 ease-out duration-150 hover:text-light-pink"
                >
                  로그인
                </Link>
              </li>
              <li className="h-header pt-3 flex justfiy-center items-center">
                <Link
                  href="/join"
                  className="text-sm pb-3 ease-out duration-150 hover:text-light-pink"
                >
                  회원가입
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
      {showsAlertBox && <AlertBox message="이미 로그아웃 된 사용자입니다." />}
    </header>
  );
}
