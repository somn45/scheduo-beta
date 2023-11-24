import { IToDo } from '@/types/interfaces/todaySkds.interface';
import ToDo from './toDo';
import { useRouter } from 'next/router';
import FinishToDo from './finished-toDo';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function ToDos({ toDos }: { toDos: IToDo[] }) {
  const [nonFinishedToDos, setNonFinishedToDos] = useState<IToDo[] | null>(
    null
  );
  const [finishedToDos, setfinishedToDos] = useState<IToDo[] | null>(null);
  const { query } = useRouter();
  const isDisplaySmall = useMediaQuery({
    query: '(max-width: 640px)',
  });

  useEffect(() => {
    if (!toDos || toDos.length === 0) {
      setNonFinishedToDos(null);
      setfinishedToDos(null);
    }
    setNonFinishedToDos(toDos.filter((toDo) => toDo.state !== 'done'));
    setfinishedToDos(toDos.filter((toDo) => toDo.state === 'done'));
  }, [toDos]);

  return (
    <article
      className={`w-full flex justify-center items-center  ${
        isDisplaySmall && 'flex-col'
      }`}
    >
      <div
        className="w-full md:w-2/3 max-w-screen-sm h-80 
      bg-slate-200  rounded-md  overflow-y-auto flex-col"
      >
        <h5 className="mb-3 pt-2 text-center">등록된 일정</h5>
        <ul className="flex flex-col justify-cneter items-center">
          {!nonFinishedToDos ? (
            <li className="text-center">등록된 일정 없음</li>
          ) : (
            nonFinishedToDos.map((toDo) => (
              <ToDo
                key={toDo.content}
                toDo={toDo}
                id={typeof query.toDosId === 'string' ? query.toDosId : ''}
              />
            ))
          )}
        </ul>
      </div>
      <div
        className="w-full md:w-2/3 max-w-screen-sm h-80 bg-slate-600 rounded-md 
      text-white overflow-y-auto flex-col"
      >
        <h5 className="mb-3 pt-2 text-center">완료된 일정</h5>
        <ul className="flex flex-col justify-cneter items-center">
          {!finishedToDos ? (
            <li className="text-center">완료된 일정 없음</li>
          ) : (
            finishedToDos.map((toDo) => (
              <FinishToDo key={toDo.content} {...toDo} />
            ))
          )}
        </ul>
      </div>
    </article>
  );
}
