import { addTodaySkdReducer } from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { CREATE_SCHEDULE_WITH_FOLLOWERS } from '@/utils/graphQL/mutations/todaySkdMutations';
import { ALL_FOLLOWERS } from '@/utils/graphQL/querys/userQuerys';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CreateScheduleFollowers from './create-schedule-followers';
import useCheckBoxWithSharingUser from '@/hooks/useCheckBoxWithSharingUser';
import { IFollower } from '@/types/interfaces/users.interface';

interface CreateScheduleModalProps {
  setShowsCreationTodaySkdModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreateScheduleModal({
  setShowsCreationTodaySkdModal,
}: CreateScheduleModalProps) {
  const [title, setTitle] = useState('');
  const [sharingUsers, setSharingUsers] = useState<IFollower[]>([]);
  const { data: followersQuery } = useQuery(ALL_FOLLOWERS);
  const [createScheduleWithFollowers] = useMutation(
    CREATE_SCHEDULE_WITH_FOLLOWERS,
    {
      errorPolicy: 'all',
    }
  );

  const [followersWithChecked, onChange] = useCheckBoxWithSharingUser({
    followers:
      !followersQuery || !followersQuery.allFollowers
        ? null
        : followersQuery.allFollowers,
  });
  const router = useRouter();

  useEffect(() => {
    if (!followersWithChecked) return;
    setSharingUsers(
      followersWithChecked
        .filter((follower) => follower.checked)
        .map((follower) => {
          const { checked, ...followerInfo } = follower;
          return followerInfo;
        })
    );
  }, [followersWithChecked]);

  const handleCreateTodaySkd = async (e: inputClickEvent) => {
    e.preventDefault();
    const { data: createScheduleWithFollowersQuery } =
      await createScheduleWithFollowers({
        variables: { title, followers: sharingUsers },
      });
    if (
      createScheduleWithFollowersQuery &&
      createScheduleWithFollowersQuery.createScheduleWithFollowers
    )
      addTodaySkdReducer(
        createScheduleWithFollowersQuery.createScheduleWithFollowers
      );
    setShowsCreationTodaySkdModal(false);
    router.push('/schedules/today');
  };

  return (
    <article
      className="w-full h-screen  bg-black/60 
    flex justify-center items-center z-20 fixed top-0 left-0"
    >
      <div
        className="w-full sm:w-3/4 lg:w-1/2 max-w-screen-sm h-3/4
        px-8 py-5 rounded-[5px] text-sm bg-slate-50 
        flex flex-col items-center"
      >
        <div className="w-full flex justify-end">
          <button
            onClick={() => setShowsCreationTodaySkdModal(false)}
            className="text-xl text-right font-semibold"
          >
            X
          </button>
        </div>
        <h5 className="mb-5 text-lg font-semibold">오늘의 일정 생성</h5>
        <form className="flex flex-col items-center">
          <div className="mb-5">
            <label className="mr-2 font-semibold">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="오늘의 일정 제목"
              className="w-72 h-8 px-2 border-2 border-input-color 
            rounded-md outline-none placeholder:text-sm
            hover:border-pink-400 focus:border-pink-400"
            />
          </div>
          <button className="mb-2">팔로워 공유</button>
          <div className="w-64 h-56 mb-3 border-4 border-slate-400 rounded-lg">
            <ul className="w-full h-full p-2">
              <CreateScheduleFollowers
                followers={followersWithChecked}
                onChange={onChange}
              />
            </ul>
          </div>
          <input
            type="submit"
            value="일정 생성"
            onClick={handleCreateTodaySkd}
          />
        </form>
      </div>
    </article>
  );
}
