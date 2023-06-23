import Join from '@/components/modal/Join';
import Login from '@/components/modal/Login';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { graphql } from '@/generates/type';

export interface AuthModelFunction {
  showLogin?: () => void;
  showJoin?: () => void;
  closeAuth: () => void;
}

const GET_USERS = graphql(`
  query GetUsers {
    allUsers {
      userId
    }
  }
`);

export default function Header({
  showLogin,
  showJoin,
  closeAuth,
}: AuthModelFunction) {
  const [showAuthModel, setShowAuthModel] = useState({
    login: false,
    join: false,
  });
  const result = useQuery(GET_USERS);

  return (
    <header className="w-full h-10 px-10 py-2 fixed flex justify-end">
      <button onClick={showLogin} className="text-sm font-semibold">
        로그인/회원가입
      </button>
    </header>
  );
}
