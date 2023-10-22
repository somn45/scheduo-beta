import Header from '@/components/layout/Header';
import Join from '@/components/modal/Join';
import Login from '@/components/modal/Login';
import { RootState } from '@/lib/store/store';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ErrorMessageBox from '../messageBox/ErrorMessageBox';
import AlertBox from '../messageBox/AlertBox';

export default function Home(props: { children: React.ReactNode }) {
  const [showAuthModel, setShowAuthModel] = useState({
    login: false,
    join: false,
  });
  const alertMessage = useSelector((state: RootState) => state.alertMessages);
  const errorMessage = useSelector((state: RootState) => state.errorMessages);
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
      <div className="h-screen px-desktop-white-space pt-8 text-sm">
        {props.children}
      </div>
      {alertMessage && <AlertBox message={alertMessage} />}
      {errorMessage && <ErrorMessageBox message={errorMessage} />}
    </>
  );
}
