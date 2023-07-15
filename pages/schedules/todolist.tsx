import { graphql } from '@/generates/type';
import { useMutation, useQuery } from '@apollo/client';
import { getCookie } from 'cookies-next';
import Link from 'next/link';
import React, { useState } from 'react';

const ALL_SCHEDULES = graphql(`
  query GetSchedules {
    allSchedules {
      _id
      title
      author
      toDos {
        content
      }
    }
  }
`);

const CREATE_SCHEDULE = graphql(`
  mutation CreateSchedule($title: String!) {
    createSchedule(title: $title) {
      _id
      title
      author
      toDos {
        content
      }
    }
  }
`);

export default function ToDoList() {
  const [title, setTitle] = useState('');
  const { data: allSchedulesQuery } = useQuery(ALL_SCHEDULES);
  const [createSchedule] = useMutation(CREATE_SCHEDULE);

  const handleCreateSchedule = async (
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    const { data } = await createSchedule({ variables: { title } });
  };

  return (
    <section>
      <form>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="오늘의 일정 제목"
        />
        <input type="submit" value="일정 생성" onClick={handleCreateSchedule} />
      </form>
      {allSchedulesQuery?.allSchedules.length === 0 && (
        <span>오늘의 일정을 등록하세요</span>
      )}
      {allSchedulesQuery?.allSchedules.length !== 0 &&
        allSchedulesQuery?.allSchedules.map((skd) => (
          <Link href={`/schedules/todos/${skd._id}`} key={skd._id}>
            <span>{skd.title}</span>
          </Link>
        ))}
    </section>
  );
}
