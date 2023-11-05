import Header from '@/components/layout/Header';
import { RootState } from '@/lib/store/store';
import React from 'react';
import { useSelector } from 'react-redux';
import ErrorMessageBox from '../common/messageBox/ErrorMessageBox';
import AlertBox from '../common/messageBox/AlertBox';
import {
  faCalendarDays,
  faCalendarWeek,
  faClock,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import MobileNav from './MobileNav';

export default function Home(props: { children: React.ReactNode }) {
  const alertMessage = useSelector((state: RootState) => state.alertMessages);
  const errorMessage = useSelector((state: RootState) => state.errorMessages);

  return (
    <div>
      <Header />
      <main
        className="w-full h-screen
        px-mobile-white-space md:px-tablet-white-space xl:px-desktop-white-space
        pt-header text-sm"
      >
        {props.children}
      </main>
      {alertMessage.value && <AlertBox message={alertMessage.value} />}
      {errorMessage.value && <ErrorMessageBox message={errorMessage.value} />}

      <MobileNav
        homeIcon={faHouse}
        todayIcon={faClock}
        weeklyIcon={faCalendarWeek}
        monthIcon={faCalendarDays}
      />
    </div>
  );
}
