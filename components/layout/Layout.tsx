import Header from '@/components/layout/Header';
import { RootState } from '@/lib/store/store';
import React, { useEffect, useState } from 'react';
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
import { useRouter } from 'next/router';

export default function Layout(props: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const alertMessage = useSelector((state: RootState) => state.alertMessages);
  const errorMessage = useSelector((state: RootState) => state.errorMessages);
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      setLoading(false);
    };
  }, [router]);

  const handleRouteChange = () => {
    setLoading(true);
  };

  return (
    <div>
      <Header />
      {alertMessage.value && <AlertBox message={alertMessage.value} />}
      {errorMessage.value && <ErrorMessageBox message={errorMessage.value} />}
      {loading ? (
        <main
          className="w-full h-screen pt-header bg-slate-300 text-2xl font-semibold 
    flex justify-center items-center"
        >
          <article
            className="[&>div]:w-5 [&>div]:h-5 [&>div]:mr-1 
  [&>div]:rounded-full [&>div]:bg-black flex"
          >
            <div className="animate-[loading_2.2s__infinite_100ms]"></div>
            <div className="animate-[loading_2.2s__infinite_200ms]"></div>
            <div className="animate-[loading_2.2s__infinite_300ms]"></div>
            <div className="animate-[loading_2.2s__infinite_400ms]"></div>
            <div className="animate-[loading_2.2s__infinite_500ms]"></div>
          </article>
        </main>
      ) : (
        <main
          className="w-full h-screen
px-mobile-white-space md:px-tablet-white-space xl:px-desktop-white-space
pt-header text-sm"
        >
          {props.children}
        </main>
      )}

      <MobileNav
        homeIcon={faHouse}
        todayIcon={faClock}
        weeklyIcon={faCalendarWeek}
        monthIcon={faCalendarDays}
      />
    </div>
  );
}
