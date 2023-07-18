import TodaySkd, { IToDo } from '@/models/TodaySkd';
import ToDoModel from '@/models/TodaySkd';
import { GraphQLError } from 'graphql';
import { ContextValue } from '../users/users.mutations';

export interface TodaySkdInfo {
  title: string;
  author: string;
}

export interface AddToDoProps {
  id: string;
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
    createSchedule: async (
      _: unknown,
      { title }: TodaySkdInfo,
      { req }: ContextValue
    ) => {
      const user = req.session.user;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const author = user.id;

      const newTodaySkd = await TodaySkd.create({
        title,
        author,
      });
      return newTodaySkd;
    },
    addToDo: async (
      _: unknown,
      { id, content, registeredAt }: AddToDoProps,
      { req }: ContextValue
    ) => {
      const { user } = req.session;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const author = user.id;

      const todaySchedule = await TodaySkd.findByIdTodaySkd(id);
      todaySchedule.toDos.push({ content, registeredAt, state: 'toDo' });
      await todaySchedule.save();
      return { content, registeredAt, state: 'toDo' };
    },
    updateToDo: async (
      _: unknown,
      { id, content, registeredAt }: UpdateToDoProps,
      { req }: ContextValue
    ) => {
      const { user } = req.session;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });

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
    deleteToDo: async (
      _: unknown,
      { id, registeredAt }: DeleteToDoProps,
      { req }: ContextValue
    ) => {
      const { user } = req.session;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });

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
