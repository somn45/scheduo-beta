import { GraphQLError } from 'graphql';
import { ContextValue } from '../users/users.mutations';
import DocedTodaySkd from '@/models/DocedTodaySkd';
import TodaySkd from '@/models/TodaySkd';
import {
  IToDo,
  TodaySchedule,
  todayScheduleWithoutState,
  todaySchedulePreview,
  todayScheduleUniqueField,
  UpdateToDoStateProps,
  TodaySkdWithFollowers,
} from '@/types/interfaces/todaySkds.interface';
import { IFollowers, IUser } from '@/types/interfaces/users.interface';
import User from '@/models/User';

interface props {
  title: string;
  followers: IFollowers[];
}

export default {
  Mutation: {
    createSchedule: async (
      _: unknown,
      { title }: todaySchedulePreview,
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
    createScheduleWithFollowers: async (
      _: unknown,
      { title, followers }: props,
      { req }: ContextValue
    ) => {
      const user = req.session.user;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const author = user.id;

      let sharingUsers = [];
      for (let follower of followers) {
        const followerWithId = await User.findUser(follower.userId);
        sharingUsers.push(followerWithId._id);
      }

      const newTodaySkd = await TodaySkd.create({
        title,
        author,
        sharingUsers,
        createdAt: Date.now(),
      });
      return {
        _id: newTodaySkd._id,
        title,
        author,
        sharingUsers: followers,
        toDos: newTodaySkd.toDos,
      };
    },
    deleteSchedule: async (
      _: unknown,
      { _id }: { _id: string },
      { req }: ContextValue
    ) => {
      const { user } = req.session;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const todaySchedule = await TodaySkd.findById(_id);
      if (!todaySchedule)
        throw new GraphQLError('Schedule not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      todaySchedule.deleteOne();
      return todaySchedule;
    },
    addToDo: async (
      _: unknown,
      { input }: { input: todayScheduleWithoutState },
      { req }: ContextValue
    ) => {
      const { id, content, registeredAt } = input;
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
      { input }: { input: todayScheduleWithoutState },
      { req }: ContextValue
    ) => {
      const { id, content, registeredAt } = input;
      const { user } = req.session;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });

      const todaySchedule = await TodaySkd.findByIdTodaySkd(id);
      const { toDos } = todaySchedule;

      const updateToDo: IToDo = { content, registeredAt, state: 'toDo' };
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
      { input }: { input: todayScheduleUniqueField },
      { req }: ContextValue
    ) => {
      const { id, registeredAt } = input;
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
      { input }: { input: UpdateToDoStateProps },
      { req }: ContextValue
    ) => {
      const { hasFinished, id, registeredAt } = input;
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
      { title }: todaySchedulePreview,
      { req }: ContextValue
    ) => {
      const { user } = req.session;
      if (!user) return;
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
      const finishedToDos: IToDo[] = todaySkd.toDos.map((toDo) => {
        if (
          new Date(toDo.registeredAt).getDay() !== nextDaySharp.getDay() &&
          toDo.registeredAt < nextDaySharp.getTime()
        )
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
      if (!user) return null;

      const todaySchedules = (await TodaySkd.find({ author: user.id }).populate(
        'sharingUsers'
      )) as TodaySkdWithFollowers[];
      if (!todaySchedules)
        throw new GraphQLError('Today schedule not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const finishedSchedules = todaySchedules.filter(
        (todaySkd) =>
          todaySkd.toDos.length !== 0 &&
          todaySkd.toDos.every((toDo) => toDo.state === 'done')
      );

      let outputDocedSchedule = [];

      for (let schedule of finishedSchedules) {
        const docedScheduleTemplate = {
          title: schedule.title,
          start: schedule.createdAt,
          end: schedule.createdAt && schedule.createdAt + 1000 * 60 * 60 * 24,
          docedToDos: schedule.toDos,
        };

        const documentedSchedule = {
          ...docedScheduleTemplate,
          author: schedule.author,
        };
        const sharingUsers = schedule.sharingUsers;
        if (sharingUsers && sharingUsers.length > 0) {
          const docedSchedulesWithSharingUsers = [
            documentedSchedule,
            ...sharingUsers.map((user) => ({
              ...documentedSchedule,
              author: user.userId,
            })),
          ];
          await DocedTodaySkd.create(docedSchedulesWithSharingUsers);
          outputDocedSchedule.push(docedSchedulesWithSharingUsers);
        } else {
          await DocedTodaySkd.create(documentedSchedule);
          outputDocedSchedule.push(documentedSchedule);
        }
      }

      finishedSchedules.map(
        async (finishedTodaySkd) =>
          await TodaySkd.deleteOne({ title: finishedTodaySkd.title })
      );
      return outputDocedSchedule;
    },
    updateTitle: async (
      _: unknown,
      { title, _id }: { title: string; _id: string },
      { req }: ContextValue
    ) => {
      const { user } = req.session;
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const todaySchedule = await TodaySkd.findById(_id).populate(
        'sharingUsers'
      );
      if (!todaySchedule)
        throw new GraphQLError('Today schedule not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const hasAccessTodaySkd = todaySchedule.author === user.id;
      const sharingUsers = todaySchedule.sharingUsers as IUser[];
      const sharedTodaySkd = sharingUsers.filter(
        (follwer) => follwer.userId === user.id
      );

      const hasSharedTodaySkd = sharedTodaySkd ? true : false;
      if (!(hasAccessTodaySkd || hasSharedTodaySkd))
        throw new GraphQLError('You have not access', {
          extensions: { code: 'BAD_REQUEST' },
        });
      todaySchedule.title = title;
      await todaySchedule.save();
      return todaySchedule;
    },
  },
};
