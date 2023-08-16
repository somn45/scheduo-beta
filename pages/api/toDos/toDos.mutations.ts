import TodaySkd, { DBTodaySkd, IToDo } from '@/models/TodaySkd';
import ToDoModel from '@/models/TodaySkd';
import { GraphQLError } from 'graphql';
import { ContextValue } from '../users/users.mutations';
import DocedTodaySkd from '@/models/DocedTodaySkd';

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

export interface UpdateToDoStateProps {
  hasFinished: boolean;
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
        createdAt: Date.now(),
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
    updateToDoState: async (
      _: unknown,
      { hasFinished, id, registeredAt }: UpdateToDoStateProps,
      { req }: ContextValue
    ) => {
      const { user } = req.session;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });

      const todaySchedule = await TodaySkd.findByIdTodaySkd(id);
      if (hasFinished) {
        const finishedToDo = todaySchedule.toDos.filter(
          (toDo) => toDo.registeredAt === registeredAt
        );
        finishedToDo[0].state = 'willDone';

        const updatedToDos = todaySchedule.toDos.map((toDo) =>
          toDo.registeredAt === registeredAt ? finishedToDo[0] : toDo
        );
        todaySchedule.toDos = updatedToDos;
        await todaySchedule.save();
        return finishedToDo[0];
      }
      const finishedToDo = todaySchedule.toDos.filter(
        (toDo) => toDo.registeredAt === registeredAt
      );

      finishedToDo[0].state = 'toDo';
      const updatedToDos = todaySchedule.toDos.map((toDo) =>
        toDo.registeredAt === registeredAt ? finishedToDo[0] : toDo
      );
      todaySchedule.toDos = updatedToDos;
      await todaySchedule.save();
      return finishedToDo[0];
    },
    finishToDos: async (
      _: unknown,
      { title }: { title: string },
      { req }: ContextValue
    ) => {
      const { user } = req.session;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const todaySkd = await TodaySkd.findOne({ title });
      if (!todaySkd)
        throw new GraphQLError('Today skd not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      if (todaySkd.toDos.length === 0) return [];

      const { toDos } = todaySkd;
      const nextDay = new Date(Date.now() + 1000 * 60 * 60 * 24);
      const nextDaySharp = new Date(
        nextDay.getFullYear(),
        nextDay.getMonth(),
        nextDay.getDate()
      );
      const finishedToDos = todaySkd.toDos.map((toDo) => {
        /*
                if (
          new Date(toDo.registeredAt).getDay() !== nextDaySharp.getDay() &&
          toDo.registeredAt < nextDaySharp.getTime()
        )
        */
        if (toDo.state === 'willDone')
          return {
            content: toDo.content,
            registeredAt: toDo.registeredAt,
            state: 'done',
          };
        return toDo;
      });
      todaySkd.toDos = finishedToDos;
      await todaySkd.save();

      return finishedToDos;
    },
    documentedToDos: async (_: unknown, __: unknown, { req }: ContextValue) => {
      const { user } = req.session;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });

      const todaySchedules = await TodaySkd.find({ author: user.id });
      if (!todaySchedules)
        throw new GraphQLError('Today schedule not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const finishedSchedules: DBTodaySkd[] = todaySchedules.filter(
        (todaySkd) =>
          todaySkd.toDos.length !== 0 &&
          todaySkd.toDos.every((toDo) => toDo.state === 'done')
      );
      const docedTodaySchedules = finishedSchedules.map((finishedSkd) => ({
        title: finishedSkd.title,
        author: finishedSkd.author,
        start: finishedSkd.createdAt,
        end:
          finishedSkd.createdAt && finishedSkd.createdAt + 1000 * 60 * 60 * 24,
        docedToDos: finishedSkd.toDos,
      }));
      await DocedTodaySkd.create(docedTodaySchedules);

      finishedSchedules.map(
        async (finishedTodaySkd) =>
          await TodaySkd.deleteOne({ title: finishedTodaySkd.title })
      );
      return docedTodaySchedules;
    },
  },
};
