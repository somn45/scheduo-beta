import Header from '@/components/layout/Header';
import { RootState } from '@/lib/store/store';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ErrorMessageBox from '../common/messageBox/ErrorMessageBox';
import AlertBox from '../common/messageBox/AlertBox';

export default function Home(props: { children: React.ReactNode }) {
  const [showAuthModel, setShowAuthModel] = useState({
    login: false,
    join: false,
  });
  const alertMessage = useSelector((state: RootState) => state.alertMessages);
  const errorMessage = useSelector((state: RootState) => state.errorMessages);

  return (
    <>
      <Header />
      <main className="px-desktop-white-space mt-10 text-sm">
        {props.children}
      </main>
      {alertMessage && <AlertBox message={alertMessage} />}
      {errorMessage && <ErrorMessageBox message={errorMessage} />}
    </>
  );
}
