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
        <ul>
          <li>
            <h4>제목 : </h4>
            <p>{event.title}</p>
          </li>
          <li>
            <h4>만든이</h4>
            <p>{event.author}</p>
          </li>
          <li>
            <h4>할일 수행 시작일</h4>
            <p>{event.start}</p>
          </li>
          <li>
            <h4>할일 수행 종료일</h4>
            <p>{event.end}</p>
          </li>
          <li>
            <h4>함께한 멤버 리스트</h4>
            <ul>
              {event.sharingUsers &&
                event.sharingUsers.map((user) => (
                  <li key={user.userId}>{user.name}</li>
                ))}
            </ul>
          </li>
          <li>
            <h4>진행했던 일정</h4>
            <ul>
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
