import { graphql } from '@/generates/type';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import DocedTodaySkd, { DBDocedTodaySkd } from '@/models/DocedTodaySkd';
import { EventContentArg } from '@fullcalendar/common';

interface Events {
  title: string;
  start: Date;
  end: Date;
  docedToDos: Array<DocedToDos>;
}

interface DocedToDos {
  content: string;
}

const ALL_DOCUMENTED_TODAY_SKDS = graphql(`
  query AllDocedTodaySkds {
    allDocedTodaySkds {
      title
      author
      start
      end
      docedToDos {
        content
      }
    }
  }
`);

const DOCUMENTED_TODOS = graphql(`
  mutation DocumentedToDos {
    documentedToDos {
      title
      author
      start
      end
      docedToDos {
        content
      }
    }
  }
`);

export default function Home() {
  const [documentedTodaySkds, setDocumentedTodaySkds] = useState<Events[]>([]);
  const [showsScheduleDetail, setShowsScheduleDetail] = useState(false);
  const calendarRef = useRef();
  const [getDocedTodaySkds] = useLazyQuery(ALL_DOCUMENTED_TODAY_SKDS);
  const [documentToDos] = useMutation(DOCUMENTED_TODOS);
  useEffect(() => {
    console.log('test');
    handleDocedToDos();
    const handleGetDocedTodaySkds = async () => {
      const { data: docedTodaySkdsQuery } = await getDocedTodaySkds();
      if (!docedTodaySkdsQuery) return;
      const calendarEvents = docedTodaySkdsQuery.allDocedTodaySkds.map(
        (todaySkd) => ({
          title: todaySkd.title,
          start: new Date(todaySkd.start),
          end: new Date(todaySkd.end),
          docedToDos: todaySkd.docedToDos,
        })
      );
      setDocumentedTodaySkds(calendarEvents);
    };
    handleGetDocedTodaySkds();
  }, []);

  const handleDocedToDos = async () => {
    const { data: documentToDosQuery } = await documentToDos();
    if (documentToDosQuery) {
      const calendarEvents = documentToDosQuery.documentedToDos.map(
        (todaySkd) => ({
          title: todaySkd.title,
          start: new Date(todaySkd.start),
          end: new Date(todaySkd.end),
          docedToDos: todaySkd.docedToDos,
        })
      );
      setDocumentedTodaySkds(calendarEvents);
    }
  };

  return (
    <main className="pt-10">
      <div className="w-1/2">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          aspectRatio={4}
          ref={calendarRef.current}
          events={documentedTodaySkds}
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
                  {documentedTodaySkds
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
