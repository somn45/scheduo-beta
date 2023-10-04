import { updateTitleTodaySkdReducer, useAppDispatch } from '@/lib/store/store';
import { buttonClickEvent, inputClickEvent } from '@/types/HTMLEvents';
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
    const { data } = await updateTodaySkdTitle({
      variables: { title: changedTitle, _id: todaySkdId ? todaySkdId : '' },
    });
    if (!data) return;

    dispatch(
      updateTitleTodaySkdReducer({
        title: data.updateTitle.title,
        _id: data.updateTitle._id,
      })
    );
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
            onClick={() => setShowsTitleChangeModel(false)}
            className="text-xl text-right font-semibold"
          >
            X
          </button>
        </div>
        <form>
          <input
            type="text"
            value={changedTitle}
            onChange={(e) => setChangedTitle(e.target.value)}
            placeholder="변경할 제목을 입력하세요."
          />
          <input type="submit" value="제목 변경" onClick={handleUpdateTitle} />
        </form>
      </div>
    </article>
  );
}
