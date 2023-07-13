import TodaySkd, { IToDo } from '@/models/TodaySkd';
import ToDoModel from '@/models/TodaySkd';
import { GraphQLError } from 'graphql';

export interface TodaySkdInfo {
  title: string;
  author: string;
}

export interface AddToDoProps {
  author: string;
  content: string;
  registeredAt: number;
}

export interface UpdateToDoProps {
  id: string;
  content: string;
  registeredAt: number;
}

export interface DeleteToDoProps {
  id: string;
  registeredAt: number;
}

export default {
  Mutation: {
    createSchedule: async (_: unknown, { title, author }: TodaySkdInfo) => {
      const newTodaySkd = {
        title,
        author,
      };
      await TodaySkd.create(newTodaySkd);
      return newTodaySkd;
    },
    addToDo: async (
      _: unknown,
      { author, content, registeredAt }: AddToDoProps
    ) => {
      const todaySchedule = await TodaySkd.findOneTodaySkd(author);
      todaySchedule.toDos.push({ content, registeredAt, state: 'toDo' });
      await todaySchedule.save();
      return { content, registeredAt, state: 'toDo' };
    },
    updateToDo: async (
      _: unknown,
      { id, content, registeredAt }: UpdateToDoProps
    ) => {
      const todaySchedule = await TodaySkd.findByIdTodaySkd(id);
      const { toDos } = todaySchedule;

      const updateToDo = { content, registeredAt, state: 'toDo' };
      const updatedToDos = toDos.map((toDo) => {
        if (toDo.registeredAt === registeredAt) return updateToDo;
        return { ...toDo };
      });
      todaySchedule.toDos = updatedToDos;
      todaySchedule.save();
      return updateToDo;
    },
    deleteToDo: async (_: unknown, { id, registeredAt }: DeleteToDoProps) => {
      const todaySchedule = await TodaySkd.findByIdTodaySkd(id);
      const { toDos } = todaySchedule;
      todaySchedule.toDos = toDos.filter(
        (toDo) => toDo.registeredAt !== registeredAt
      );
      await todaySchedule.save();
      return todaySchedule.toDos;
    },
  },
};
