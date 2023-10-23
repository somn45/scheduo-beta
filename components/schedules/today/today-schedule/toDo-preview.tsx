import { IToDo } from '@/types/interfaces/todaySkds.interface';

interface ToDoPreviewProps {
  toDo: IToDo;
}

export default function ToDoPreview({ toDo }: ToDoPreviewProps) {
  return (
    <li key={toDo.content} className="border-b-2 border-schedule-content-color">
      <div className="pl-2 text-xs text-slate-800 before:content-['o'] before:mr-1">
        {toDo.content}
      </div>
    </li>
  );
}
