import { IToDo } from '@/types/interfaces/todaySkds.interface';
import ToDo from './toDo';
import { useRouter } from 'next/router';
import FinishToDo from './finished-toDo';
import { useEffect, useState } from 'react';

export default function ToDos({ toDos }: { toDos: IToDo[] }) {
  const [nonFinishedToDos, setNonFinishedToDos] = useState<IToDo[] | null>(
    null
  );
  const [finishedToDos, setfinishedToDos] = useState<IToDo[] | null>(null);
  const { query } = useRouter();

  useEffect(() => {
    if (!toDos || toDos.length === 0) {
      setNonFinishedToDos(null);
      setfinishedToDos(null);
    }
    setNonFinishedToDos(toDos.filter((toDo) => toDo.state !== 'done'));
    setfinishedToDos(toDos.filter((toDo) => toDo.state === 'done'));
  }, [toDos]);

  return (
    <article className="flex justify-cneter">
      <ul className="w-1/2 flex flex-col justify-cneter items-center">
        <h5 className="mb-3">등록된 일정</h5>
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
      <ul className="w-1/2 h-80 bg-slate-200 rounded-md flex flex-col justify-cneter items-center">
        <h5 className="mb-3">완료된 일정</h5>
        {!finishedToDos ? (
          <li className="text-center">완료된 일정 없음</li>
        ) : (
          finishedToDos.map((toDo) => (
            <FinishToDo key={toDo.content} {...toDo} />
          ))
        )}
      </ul>
    </article>
  );
}
