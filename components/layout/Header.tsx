import { useQuery } from '@apollo/client';
import { graphql } from '@/generates/type';
import Link from 'next/link';

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

export default function Header({ showLogin }: AuthModelFunction) {
  const result = useQuery(GET_USERS);
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
      <button
        onClick={showLogin}
        className="text-sm font-semibold  ease-out duration-150 hover:text-pink-400"
      >
        로그인/회원가입
      </button>
    </header>
  );
}
