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
import { EventWithAuthor } from '@/types/interfaces/documentedTodaySchedules.interface';

export default function Home({ events }: { events: EventWithAuthor[] }) {
  const [showsScheduleDetail, setShowsScheduleDetail] = useState(false);
  const calendarRef = useRef();

  return (
    <main className="pt-10">
      <div className="w-1/2">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          aspectRatio={2}
          ref={calendarRef.current}
          events={events}
          eventMouseEnter={() => setShowsScheduleDetail(true)}
          eventMouseLeave={() => setShowsScheduleDetail(false)}
          eventContent={(eventInfo: EventContentArg) => (
            <div className="flex flex-row relative cursor-pointer">
              <span className="mr-1">{eventInfo.timeText}</span>
              <h5>{eventInfo.event.title}</h5>
              {showsScheduleDetail && (
                <ul
                  className="w-28 h-20 p-2 bg-white border-none rounded-md absolute left-2 bottom-[-90px]
                  after:content-[''] after:absolute after:top-[-15px] after:left-5
                  after:border-l-[10px] after:border-r-[10px] after:border-b-[20px] 
                  after:border-b-white after:border-l-transparent after:border-r-transparent
                "
                >
                  {events
                    .filter(
                      (docedTodaySkds) =>
                        docedTodaySkds.title === eventInfo.event.title
                    )[0]
                    .docedToDos.map((docedToDo) => (
                      <li key={docedToDo.content} className="text-black">
                        {docedToDo.content}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        />
      </div>
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
        title: todaySkd.title,
        author: todaySkd.author,
        start: todaySkd.start,
        end: todaySkd.end,
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
