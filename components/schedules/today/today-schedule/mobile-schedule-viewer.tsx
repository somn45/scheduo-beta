import Icon from '@/components/common/icon/icon';
import { TodayScheduleWithID } from '@/types/interfaces/todaySkds.interface';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { useState } from 'react';
import TitleChangeModal from './change-title.model';
import { useMutation } from '@apollo/client';
import { DELETE_SCHEDULE } from '@/utils/graphQL/mutations/todaySkdMutations';

interface MobileTodayScheduleViewerProps {
  schedule: TodayScheduleWithID;
  showsTitleChangeModel: boolean;
  setShowsTitleChangeModel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MobileScheduleViewer({
  schedule,
  showsTitleChangeModel,
  setShowsTitleChangeModel,
}: MobileTodayScheduleViewerProps) {
  const [deleteSchedule] = useMutation(DELETE_SCHEDULE, { errorPolicy: 'all' });
  return (
    <>
      <div
        className="h-20 border-b-2 border-sky-300
    flex flex-col justify-between"
      >
        <Link href={`/schedules/today/${schedule._id}`} key={schedule._id}>
          <ul className="py-3 flex justify-between">
            <li className="text-xl font-semibold">{schedule.title}</li>
            <li className="text-slate-600">{schedule.author}</li>
          </ul>
        </Link>
        <ul className="flex justify-end">
          <li>
            <button
              onClick={() => setShowsTitleChangeModel(true)}
              className="mr-2"
            >
              <Icon icon={faPen} />
            </button>
          </li>
          <li>
            <Icon icon={faXmark} />
          </li>
        </ul>
      </div>
      {showsTitleChangeModel && (
        <TitleChangeModal
          todaySkdId={schedule._id}
          title=""
          setShowsTitleChangeModel={setShowsTitleChangeModel}
        />
      )}
    </>
  );
}
