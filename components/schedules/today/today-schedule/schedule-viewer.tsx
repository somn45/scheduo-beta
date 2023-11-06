import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { TodayScheduleWithID } from '@/types/interfaces/todaySkds.interface';
import TitleChangeModal from './change-title.model';
import ToDoPreview from './toDo-preview';
import TodayScheduleUtilButtons from './schedule-util-buttons';

interface TodayScheduleProps {
  schedule: TodayScheduleWithID;
  showsTitleChangeModel: boolean;
  setShowsTitleChangeModel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TodayScheduleViewer({
  schedule,
  showsTitleChangeModel,
  setShowsTitleChangeModel,
}: TodayScheduleProps) {
  return (
    <div className="flex flex-col items-center">
      <Link href={`/schedules/today/${schedule._id}`} key={schedule._id}>
        <div
          className="w-schedule-viewer h-schedule-viewer mb-2
        bg-schedule-color border-2 border-schedule-board-color rounded-md"
        >
          <h1
            className="h-1/6 p-2 bg-slate-300
          font-solmee text-lg text-semibold text-center"
          >
            {schedule.title}
          </h1>
          <p
            className="h-1/6 p-1 bg-slate-300
          text-end text-slate-500"
          >
            {schedule.author}
          </p>
          <ul className="w-full h-1/3 bg-schedule-color flex flex-col relative">
            {schedule.toDos.length === 0 && (
              <div className="w-full h-full flex justify-center items-center">
                일정 없음
              </div>
            )}
            {schedule.toDos.map((toDo) => (
              <ToDoPreview key={toDo.content} toDo={toDo} />
            ))}
          </ul>
          <div className="h-1/3 p-1 bg-sky-50">
            <h4 className="text-lg font-solmee text-center">멤버</h4>
            <ul className="grid grid-cols-4 gap-1">
              {schedule.sharingUsers &&
                schedule.sharingUsers.map((user) => (
                  <li
                    key={user.userId}
                    className="bg-slate-300 rounded-lg font-solmee text-sm
                    flex justify-center items-center"
                  >
                    {user.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Link>
      <TodayScheduleUtilButtons
        schedule={schedule}
        setShowsTitleChangeModel={setShowsTitleChangeModel}
      />
      {showsTitleChangeModel && (
        <TitleChangeModal
          todaySkdId={schedule._id}
          title={''}
          setShowsTitleChangeModel={setShowsTitleChangeModel}
        />
      )}
    </div>
  );
}
