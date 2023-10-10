import { addTodaySkdReducer, useAppDispatch } from '@/lib/store/store';
import { buttonClickEvent, inputClickEvent } from '@/types/HTMLEvents';
import {
  CREATE_SCHEDULE,
  CREATE_SCHEDULE_WITH_FOLLOWERS,
} from '@/utils/graphQL/mutations/todaySkdMutations';
import { ALL_FOLLOWERS } from '@/utils/graphQL/querys/userQuerys';
import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import FollowerToShare from '../FollowerToShare';
import { IFollowers } from '@/types/interfaces/users.interface';
import { useRouter } from 'next/router';
import AlertBoxNonLogged from '../messageBox/AlertBoxIfNonLogged';

interface CreationTodaySkdModalProps {
  setShowsCreationTodaySkdModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CreationTodaySkdModal({
  setShowsCreationTodaySkdModal,
}: CreationTodaySkdModalProps) {
  const [title, setTitle] = useState('');
  const [sharingFollowers, setSharingFollowers] = useState<IFollowers[]>([]);
  const [showsAlertBox, setShowsAlertBox] = useState(false);
  const { data: followersQuery } = useQuery(ALL_FOLLOWERS);
  const [createScheduleWithFollowers] = useMutation(
    CREATE_SCHEDULE_WITH_FOLLOWERS,
    {
      errorPolicy: 'all',
    }
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleCreateTodaySkd = async (e: inputClickEvent) => {
    e.preventDefault();
    const followers = sharingFollowers.map((follower) => {
      {
        delete follower.__typename;
        return follower;
      }
    });
    const { data, errors } = await createScheduleWithFollowers({
      variables: { title, followers },
    });
    if (errors && errors[0].message === 'User not found')
      return setShowsAlertBox(true);
    if (data && data.createScheduleWithFollowers)
      addTodaySkdReducer(data.createScheduleWithFollowers);
    setShowsCreationTodaySkdModal(false);
    router.push('/schedules/todolist');
  };

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
              {!followersQuery && <li>팔로워가 없습니다.</li>}
              {followersQuery &&
                followersQuery.allFollowers &&
                followersQuery.allFollowers.map((follower) => (
                  <FollowerToShare
                    key={follower.userId}
                    follower={{
                      ...follower,
                      email: follower.email ? follower.email : '',
                      company: follower.company ? follower.company : '',
                    }}
                    setSharingFollowers={setSharingFollowers}
                  />
                ))}
            </ul>
          </div>
          <input
            type="submit"
            value="일정 생성"
            onClick={handleCreateTodaySkd}
          />
        </form>
        {showsAlertBox && <AlertBoxNonLogged />}
      </div>
    </article>
  );
}
