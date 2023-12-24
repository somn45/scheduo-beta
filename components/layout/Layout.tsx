import Header from '@/components/layout/Header';
import wrapper, { RootState, signIn } from '@/lib/store/store';
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
import { withIronSessionSsr } from 'iron-session/next';
import { GET_USER } from '@/utils/graphQL/querys/userQuerys';
import request from 'graphql-request';

interface LayoutProps {
  children: React.ReactNode;
  userId: string;
}

export default function Layout({ children, userId }: LayoutProps) {
  const [loading, setLoading] = useState(false);
  const alertMessage = useSelector((state: RootState) => state.alertMessages);
  const errorMessage = useSelector((state: RootState) => state.errorMessages);
  const loggedUser = useSelector((state: RootState) => state.loggedUser);
  const router = useRouter();

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      setLoading(false);
    };
  }, [router]);

  const handleRouteChange = () => setLoading(true);

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
          {children}
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

export const getServerSideProps = withIronSessionSsr(
  wrapper.getServerSideProps((store) => async ({ req }) => {
    const getUserQuery = await request(
      'http://localhost:3000/api/graphql',
      GET_USER
    );
    store.dispatch(
      signIn({
        userId: getUserQuery.getUser?.userId,
        id: getUserQuery.getUser?._id,
      })
    );
    return {
      props: {
        userId: getUserQuery.getUser?.userId,
      },
    };
  }),
  {
    cookieName: 'uid',
    password: process.env.SESSION_PASSWORD ? process.env.SESSION_PASSWORD : '',
  }
);
