import {
  setAlertMessageReducer,
  setErrorMessageReducer,
  updateTitleTodaySkdReducer,
  updateTodayScheduleMembersReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { TodayScheduleWithID } from '@/types/interfaces/todaySkds.interface';
import { GRAPHQL_ERROR_MESSAGE_LIST } from '@/utils/constants/constants';
import {
  UPDATE_TODAY_SKD_MEMBERS,
  UPDATE_TODAY_SKD_TITLE,
} from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import SharingUsersItem from './SharingUserItem';
import { ALL_FOLLOWERS } from '@/utils/graphQL/querys/userQuerys';
import useUpdateSharingUsers from '@/hooks/useUpdateSharingUsers';

interface TitleChangeModalProps {
  schedule: TodayScheduleWithID;
  setShowsManageScheduleModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TitleChangeModal({
  schedule,
  setShowsManageScheduleModal,
}: TitleChangeModalProps) {
  const [changedTitle, setChangedTitle] = useState(schedule.title);
  const [sharingUsers, setSharingUsers] = useState(schedule.sharingUsers);
  const { data: followersQuery } = useQuery(ALL_FOLLOWERS);
  const [updateTodaySkdTitle] = useMutation(UPDATE_TODAY_SKD_TITLE);
  const [updateTodayScheduleMembers] = useMutation(UPDATE_TODAY_SKD_MEMBERS);
  const dispatch = useAppDispatch();

  const [followersWithChecked, onChange] = useUpdateSharingUsers({
    followers:
      !followersQuery || !followersQuery.allFollowers
        ? null
        : followersQuery.allFollowers,
    sharingUsers: schedule.sharingUsers,
  });

  useEffect(() => {
    if (followersWithChecked) {
      setSharingUsers(
        followersWithChecked
          .filter((follower) => follower.checked)
          .map((follower) => {
            const { checked, ...followerInfo } = follower;
            return followerInfo;
          })
      );
    }
  }, [followersWithChecked]);

  const handleUpdateTitle = async (e: inputClickEvent) => {
    e.preventDefault();
    const {
      data: updateTodayScheduleTitleQuery,
      errors: updateTodayScheduleTiTleErrors,
    } = await updateTodaySkdTitle({
      variables: { title: changedTitle, _id: schedule._id ? schedule._id : '' },
    });
    if (updateTodayScheduleTiTleErrors) {
      if (
        updateTodayScheduleTiTleErrors[0].message ===
        '하루 일정을 찾을 수 없습니다.'
      )
        dispatch(setAlertMessageReducer('하루 일정을 찾을 수 없습니다.'));
      return dispatch(
        setErrorMessageReducer(
          GRAPHQL_ERROR_MESSAGE_LIST[updateTodayScheduleTiTleErrors[0].message]
        )
      );
    }
    if (!updateTodayScheduleTitleQuery) return;

    dispatch(
      updateTitleTodaySkdReducer({
        title: updateTodayScheduleTitleQuery.updateTitle.title,
        _id: updateTodayScheduleTitleQuery.updateTitle._id,
      })
    );
  };

  const handleUpdateSharingUsers = async () => {
    if (sharingUsers) {
      const { data, errors } = await updateTodayScheduleMembers({
        variables: {
          _id: schedule._id ? schedule._id : '',
          sharingUsers,
        },
      });
      if (data?.updateSharingUsers.sharingUsers) {
        dispatch(
          updateTodayScheduleMembersReducer({
            _id: schedule._id ? schedule._id : '',
            sharingUsers: data?.updateSharingUsers.sharingUsers,
          })
        );
      }
    }
  };

  return (
    <article
      className="w-full h-screen  bg-black/60 
  flex justify-center items-center z-20 fixed top-0 left-0"
    >
      <div
        className="w-full sm:w-1/2 lg:w-1/3 max-w-screen-sm h-1/2 px-8 py-5 
        rounded-[5px] text-sm bg-slate-50 flex flex-col items-center"
      >
        <div className="w-full flex justify-end">
          <button
            onClick={() => setShowsManageScheduleModal(false)}
            className="mb-10 text-xl text-right font-semibold"
          >
            X
          </button>
        </div>
        <form className="flex items-center">
          <input
            type="text"
            value={changedTitle}
            onChange={(e) => setChangedTitle(e.target.value)}
            placeholder="변경할 제목을 입력하세요."
            className="w-60 h-10 mb-5 px-2 border-2 border-slate-200 rounded-sm outline-none"
          />
          <input
            type="submit"
            value="제목 변경"
            onClick={handleUpdateTitle}
            className="w-32 h-8 bg-slate-300 rounded-sm text-lg text-center cursor-pointer"
          />
        </form>
        <ul>
          <SharingUsersItem
            followers={followersWithChecked}
            onChange={onChange}
          />
        </ul>
        <button onClick={handleUpdateSharingUsers}>일정 공유 회원 변경</button>
      </div>
    </article>
  );
}
