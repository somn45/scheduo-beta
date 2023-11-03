import { gql } from '@/generates/type';
import { useLazyQuery, useMutation } from '@apollo/client';
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

export default function Home({ events }: { events: Event[] }) {
  const [eventDetail, setEventDetail] = useState<Event | null>(null);
  const calendarRef = useRef();

  return (
    <main className="pt-10">
      <div className="w-1/2">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          aspectRatio={2}
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
      </div>
      {eventDetail && (
        <EventDetail event={eventDetail} setEventDetail={setEventDetail} />
      )}
    </main>
  );
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const storedSessionUser = req.session.user;
    if (!storedSessionUser) {
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
