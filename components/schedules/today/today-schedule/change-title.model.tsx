import {
  setAlertMessageReducer,
  setErrorMessageReducer,
  updateTitleTodaySkdReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { GRAPHQL_ERROR_MESSAGE_LIST } from '@/utils/constants/constants';
import { UPDATE_TODAY_SKD_TITLE } from '@/utils/graphQL/mutations/todaySkdMutations';
import { useMutation } from '@apollo/client';
import { useState } from 'react';

interface TitleChangeModalProps {
  todaySkdId?: string;
  title: string;
  setShowsTitleChangeModel: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TitleChangeModal({
  todaySkdId,
  title,
  setShowsTitleChangeModel,
}: TitleChangeModalProps) {
  const [changedTitle, setChangedTitle] = useState(title);
  const [updateTodaySkdTitle] = useMutation(UPDATE_TODAY_SKD_TITLE);
  const dispatch = useAppDispatch();

  const handleUpdateTitle = async (e: inputClickEvent) => {
    e.preventDefault();
    const {
      data: updateTodayScheduleTitleQuery,
      errors: updateTodayScheduleTiTleErrors,
    } = await updateTodaySkdTitle({
      variables: { title: changedTitle, _id: todaySkdId ? todaySkdId : '' },
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

  return (
    <article
      className="w-full h-screen  bg-black/60 
  flex justify-center items-center z-20 fixed top-0 left-0"
    >
      <div
        className="w-full sm:w-1/2 lg:w-1/3 max-w-screen-sm h-1/3 px-8 py-5 
        rounded-[5px] text-sm bg-slate-50 flex flex-col items-center"
      >
        <div className="w-full flex justify-end">
          <button
            onClick={() => setShowsTitleChangeModel(false)}
            className="mb-10 text-xl text-right font-semibold"
          >
            X
          </button>
        </div>
        <form className="flex flex-col items-center">
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
      </div>
    </article>
  );
}
