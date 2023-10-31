import { IToDo, ITodoWithId } from '@/types/interfaces/todaySkds.interface';
import React, { useState } from 'react';
import EditToDo from './edit-toDo';
import UpdateToDoButton from './update-toDo-button';
import DeleteToDoButton from './delete-toDo-button';
import SetStateCheckbox from './set-state-checkbox';

interface ToDoProps {
  toDo: IToDo;
  id: string;
}

export default function ToDo({
  toDo: { content, registeredAt, updatedAt, state },
  id,
}: ToDoProps) {
  const [checked, setChecked] = useState(state === 'willDone' ? true : false);
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <li className="w-80 mb-1 flex justify-between">
      {isEditMode ? (
        <EditToDo
          content={content}
          registeredAt={registeredAt}
          updatedAt={updatedAt}
          id={id}
          setIsEditMode={setIsEditMode}
        />
      ) : (
        <>
          <div>
            <SetStateCheckbox
              content={content}
              registeredAt={registeredAt}
              id={id}
              checked={checked}
              setChecked={setChecked}
            />
            <span
              className={`mr-2 text-2xl underline ${checked && `line-through`}`}
            >
              {content}
            </span>
          </div>
          <div>
            <UpdateToDoButton setIsEditMode={setIsEditMode} />
            <DeleteToDoButton registeredAt={registeredAt} id={id} />
          </div>
        </>
      )}
    </li>
  );
}
