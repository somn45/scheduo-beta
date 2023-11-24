import { Event } from '@/types/interfaces/documentedTodaySchedules.interface';
import { Dispatch, SetStateAction } from 'react';
import EventMembers from './event-members';

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
  flex justify-center items-center z-50 fixed top-0 left-0"
    >
      <div
        className="w-full sm:w-3/4 max-w-screen-md h-[600px] px-8 py-5 rounded-[5px] text-sm bg-slate-50 
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
        <ul className="w-full mt-5 flex flex-col items-center">
          <li className="w-full mb-3 flex justify-between">
            <h4 className="font-semibold">제목</h4>
            <p>{event.title}</p>
          </li>
          <li className="w-full mb-3 flex justify-between">
            <h4 className="font-semibold">만든이</h4>
            <p>{event.author}</p>
          </li>
          <li className="w-full mb-3 flex justify-between">
            <h4 className="font-semibold">할일 수행 시작일</h4>
            <p>{event.start}</p>
          </li>
          <li className="w-full mb-3 flex justify-between">
            <h4 className="font-semibold">할일 수행 종료일</h4>
            <p>{event.end}</p>
          </li>
          <li className="w-full mb-3 flex flex-col items-center">
            <h4 className="mb-2 font-semibold">함께한 멤버 리스트</h4>
            <ul className="w-full grid grid-cols-2 place-items-center">
              {event.sharingUsers &&
                event.sharingUsers.map((user) => (
                  <EventMembers key={user.userId} user={user} />
                ))}
            </ul>
          </li>
          <li className="w-full mb-3 flex flex-col items-center">
            <h4 className="mb-2 font-semibold">진행했던 일정</h4>
            <ul className="list-disc">
              {event.docedToDos.map((toDo) => (
                <li key={toDo.content}>{toDo.content}</li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
    </article>
  );
}
