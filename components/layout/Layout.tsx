import Header from '@/components/layout/Header';
import Join from '@/components/modal/Join';
import Login from '@/components/modal/Login';
import React, { useState } from 'react';

export default function Home(props: { children: React.ReactNode }) {
  const [showAuthModel, setShowAuthModel] = useState({
    login: false,
    join: false,
  });
  const showLogin = () => setShowAuthModel({ login: true, join: false });
  const showJoin = () => setShowAuthModel({ login: false, join: true });
  const closeAuth = () => setShowAuthModel({ login: false, join: false });

  return (
    <>
      <Header showLogin={showLogin} showJoin={showJoin} closeAuth={closeAuth} />
      {showAuthModel.login && (
        <Login showJoin={showJoin} closeAuth={closeAuth} />
      )}
      {showAuthModel.join && (
        <Join showLogin={showLogin} closeAuth={closeAuth} />
      )}
      <div className="h-screen pt-8 bg-main-color text-sm">
        {props.children}
      </div>
    </>
  );
}
