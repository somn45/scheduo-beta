import Join from '@/components/Join';
import Login from '@/components/Login';
import Link from 'next/link';
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

export default function Home() {
  const [showAuthModel, setShowAuthModel] = useState({
    login: false,
    join: false,
  });
  const result = useQuery(GET_USERS);

  const showLogin = () => setShowAuthModel({ login: true, join: false });
  const showJoin = () => setShowAuthModel({ login: false, join: true });
  const closeAuth = () => setShowAuthModel({ login: false, join: false });
  return (
    <main>
      <button onClick={showLogin}>로그인/회원가입</button>
      {showAuthModel.login && (
        <Login showJoin={showJoin} closeAuth={closeAuth} />
      )}
      {showAuthModel.join && (
        <Join showLogin={showLogin} closeAuth={closeAuth} />
      )}
    </main>
  );
}
