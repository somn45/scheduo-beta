import { TodayScheduleWithID } from '@/types/interfaces/todaySkds.interface';
import TodayScheduleViewer from './today-schedule/schedule-viewer';
import { useState } from 'react';

export default function TodayScheduleList({
  todaySchedules,
}: {
  todaySchedules: TodayScheduleWithID[];
}) {
  const [showsTitleChangeModel, setShowsTitleChangeModel] = useState(false);

  return (
    <article className="w-full h-full px-72 pt-[15px] grid gap-4 grid-cols-4">
      {todaySchedules.map((schedule) => (
        <TodayScheduleViewer
          key={schedule._id}
          schedule={schedule}
          showsTitleChangeModel={showsTitleChangeModel}
          setShowsTitleChangeModel={setShowsTitleChangeModel}
        />
      ))}
    </article>
  );
}