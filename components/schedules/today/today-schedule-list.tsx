import { TodayScheduleWithID } from '@/types/interfaces/todaySkds.interface';
import TodayScheduleViewer from './today-schedule/schedule-viewer';
import { useState } from 'react';
import MobileScheduleViewer from './today-schedule/mobile-schedule-viewer';

export default function TodayScheduleList({
  todaySchedules,
}: {
  todaySchedules: TodayScheduleWithID[];
}) {
  const [showsTitleChangeModel, setShowsTitleChangeModel] = useState(false);

  return (
    <>
      <article
        className="w-full h-full px-mobile-white-space pt-[15px]
    overflow-auto hidden sm:grid gap-4 grid-cols-4"
      >
        {todaySchedules.map((schedule) => (
          <TodayScheduleViewer
            key={schedule._id}
            schedule={schedule}
            showsTitleChangeModel={showsTitleChangeModel}
            setShowsTitleChangeModel={setShowsTitleChangeModel}
          />
        ))}
      </article>
      <article className="flex flex-col sm:hidden">
        {todaySchedules.map((schedule) => (
          <MobileScheduleViewer
            schedule={schedule}
            showsTitleChangeModel={showsTitleChangeModel}
            setShowsTitleChangeModel={setShowsTitleChangeModel}
          />
        ))}
      </article>
    </>
  );
}
