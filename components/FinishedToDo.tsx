import { IToDo } from '@/types/interfaces/todaySkds.interface';

export default function FinishToDos({ content }: IToDo) {
  return (
    <li>
      <div>
        <span className={`mr-2 text-2xl text-slate-400 underline`}>
          {content}
        </span>
      </div>
    </li>
  );
}
