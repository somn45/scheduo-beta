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
    <>
      <Link href={`/schedules/today/${schedule._id}`} key={schedule._id}>
        <div className="w-40 h-44 py-2 bg-schedule-color border-2 border-schedule-board-color rounded-md">
          <ul className="w-full h-full flex flex-col relative">
            <FontAwesomeIcon
              icon={faClipboard}
              className="opacity-75 text-xl absolute top-[-15px] left-[-5px]"
            />
            <h4 className="mb-1 pb-2 border-b-2 border-schedule-board-color text-md font-semibold text-center">
              {schedule.title}
            </h4>
            {schedule.toDos.length === 0 && (
              <div className="w-full h-full flex justify-center items-center">
                일정 없음
              </div>
            )}
            {schedule.toDos.map((toDo) => (
              <ToDoPreview key={toDo.content} toDo={toDo} />
            ))}
          </ul>
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
    </>
  );
}
