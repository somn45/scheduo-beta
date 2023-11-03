import { Event } from '@/types/interfaces/documentedTodaySchedules.interface';
import { Dispatch, SetStateAction } from 'react';

interface EventDetailProps {
  event: Event;
  setEventDetail: Dispatch<SetStateAction<Event | null>>;
}

export default function EventDetail({
  event,
  setEventDetail,
}: EventDetailProps) {
  return (
    <article
      className="w-full h-screen  bg-black/60 
  flex justify-center items-center z-20 fixed top-0 left-0"
    >
      <div
        className="w-1/4 px-8 py-5 rounded-[5px] text-sm bg-slate-50 
      flex flex-col items-center"
      >
        <div className="w-full flex justify-end">
          <button
            onClick={() => setEventDetail(null)}
            className="text-xl text-right font-semibold"
          >
            X
          </button>
        </div>

        {event.title}
      </div>
    </article>
  );
}
