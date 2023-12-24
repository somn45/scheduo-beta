import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventContentArg } from '@fullcalendar/common';
import {
  ALL_DOCUMENTED_TODAY_SKDS,
  DOCUMENTED_TODOS,
} from '@/utils/graphQL/mutations/todaySkdMutations';
import { withIronSessionSsr } from 'iron-session/next';
import request from 'graphql-request';
import { Event } from '@/types/interfaces/documentedTodaySchedules.interface';
import EventDetail from '@/components/calendar/event-detail';
import { useMediaQuery } from 'react-responsive';
import MobileCalendar from '@/components/dashBoard/mobile-calendar';
import { useRouter } from 'next/router';
import { useLazyQuery } from '@apollo/client';
import { GET_USER } from '@/utils/graphQL/querys/userQuerys';

export default function Home({ events }: { events: Event[] }) {
  const [eventDetail, setEventDetail] = useState<Event | null>(null);
  const [isMobileSize, setIsMobileSize] = useState(true);
  const [isTabletSize, setIsTabletSize] = useState(false);
  const [showsMobileCalendar, setShowsMobileCalendar] = useState(false);
  const [check] = useLazyQuery(GET_USER);
  const calendarRef = useRef();
  const isMobile = useMediaQuery({
    query: '(max-width: 639px)',
  });

  const isTablet = useMediaQuery({
    query: '(max-width: 1023px)',
  });

  useEffect(() => {
    isMobile ? setIsMobileSize(true) : setIsMobileSize(false);
    isTablet ? setIsTabletSize(true) : setIsTabletSize(false);
    return () => {};
  }, [isMobile, isTablet]);

  return (
    <section className="mt-10 flex">
      <article className="w-full lg:w-1/2 h-calendar hidden sm:block">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          aspectRatio={isMobileSize ? 0.5 : isTabletSize ? 1.3 : 1.5}
          ref={calendarRef.current}
          events={events}
          eventClick={(info) => {
            const eventDetail = events.filter(
              (event) => event.id === info.event.id
            );
            setEventDetail(eventDetail[0]);
          }}
          eventContent={(eventInfo: EventContentArg) => (
            <div className="flex flex-row relative cursor-pointer">
              <span className="mr-1">{eventInfo.timeText}</span>
              <h5>{eventInfo.event.title}</h5>
            </div>
          )}
        />
      </article>
      <article className="h-10 flex sm:hidden justify-center">
        <button
          onClick={() => setShowsMobileCalendar(true)}
          className="px-5 border-2 rounded-md font-solmee text-lg cursor-pointer
          hover:bg-slate-300"
        >
          일정 달력 열기
        </button>
      </article>
      {showsMobileCalendar && (
        <MobileCalendar
          events={events}
          setShowsMobileCalendar={setShowsMobileCalendar}
        />
      )}
      {eventDetail && (
        <EventDetail event={eventDetail} setEventDetail={setEventDetail} />
      )}
    </section>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const storedSessionUser = req.session.user;
    if (!storedSessionUser || !storedSessionUser.id) {
      return {
        props: { events: [] },
      };
    }
    const documentToDosQuery = await request(
      'http://localhost:3000/api/graphql',
      DOCUMENTED_TODOS,
      { userId: storedSessionUser.id }
    );

    const getDocumentTodayScheduleQuery = await request(
      'http://localhost:3000/api/graphql',
      ALL_DOCUMENTED_TODAY_SKDS,
      { userId: storedSessionUser.id }
    );
    if (!getDocumentTodayScheduleQuery.allDocedTodaySkds) {
      return {
        props: { events: [] },
      };
    }

    const calendarEvents = getDocumentTodayScheduleQuery.allDocedTodaySkds.map(
      (todaySkd) => ({
        id: todaySkd._id,
        title: todaySkd.title,
        author: todaySkd.author,
        start: todaySkd.start,
        end: todaySkd.end,
        sharingUsers: todaySkd.sharingUsers ? todaySkd.sharingUsers : [],
        docedToDos: todaySkd.docedToDos,
      })
    );

    if (documentToDosQuery.documentedToDos) {
      return {
        props: {
          events: [...calendarEvents, ...documentToDosQuery.documentedToDos],
        },
      };
    }

    return {
      props: { events: calendarEvents },
    };
  },
  {
    cookieName: 'uid',
    password: process.env.SESSION_PASSWORD ? process.env.SESSION_PASSWORD : '',
  }
);
