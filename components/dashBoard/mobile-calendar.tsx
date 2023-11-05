import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useState, useRef, Dispatch, SetStateAction } from 'react';
import { EventContentArg } from '@fullcalendar/common';
import { Event } from '@/types/interfaces/documentedTodaySchedules.interface';
import EventDetail from '../calendar/event-detail';

interface MobileCalendarProps {
  events: Event[];
  setShowsMobileCalendar: Dispatch<SetStateAction<boolean>>;
}

export default function MobileCalendar({
  events,
  setShowsMobileCalendar,
}: MobileCalendarProps) {
  const [eventDetail, setEventDetail] = useState<Event | null>(null);
  const calendarRef = useRef();
  return (
    <div className="w-full h-screen px-2 bg-slate-300 fixed sm:hidden left-0 top-0 z-50">
      <button
        onClick={() => setShowsMobileCalendar(false)}
        className="w-full h-10 text-xl font-semibold flex justify-end items-center"
      >
        X
      </button>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        aspectRatio={0.5}
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
      {eventDetail && (
        <EventDetail event={eventDetail} setEventDetail={setEventDetail} />
      )}
    </div>
  );
}
