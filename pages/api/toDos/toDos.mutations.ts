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
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError('게스트로 접근할 수 없는 기능입니다.', {
          extensions: { code: 'GUEST_UNAUTHENTICATED' },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(_id)
      ).populate<{ sharingUsers: IUser[] }>('sharingUsers');
      if (!todaySchedule)
        throw new GraphQLError('하루 일정을 찾을 수 없습니다.', {
          extensions: { code: 'NOT_FOUND' },
        });

      // 하루 일정의 작성자가 로그인된 본인인지 확인하는 boolean 변수
      const hasAccessTodaySkd = todaySchedule.author === storedSessionUser.id;
      const sharingUsers = todaySchedule.sharingUsers;
      const sharedTodaySkd = sharingUsers.filter(
        (follwer) => follwer.userId === storedSessionUser.id
      );

      // 위의 조건과 더블어 로그인된 본인이 하루 일정을 공유하고 있는 사용자인지 확인
      if (!(hasAccessTodaySkd || sharedTodaySkd.length !== 0))
        throw new GraphQLError('권한이 없습니다.', {
          extensions: { code: 'UNAUTHORIZED' },
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
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError('게스트는 접근할 수 없는 기능입니다.', {
          extensions: { code: 'GUEST_UNAUTHENTICATED' },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(id)
      ).populate<{ sharingUsers: IUser[] }>('sharingUsers');

      const hasAccessTodaySkd = todaySchedule.author === storedSessionUser.id;
      const sharingUsers = todaySchedule.sharingUsers;
      const sharedTodaySkd = sharingUsers.filter(
        (follwer) => follwer.userId === storedSessionUser.id
      );

      const hasSharedTodaySkd = sharedTodaySkd.length !== 0 ? true : false;
      if (!(hasAccessTodaySkd || hasSharedTodaySkd))
        throw new GraphQLError('권한이 없습니다.', {
          extensions: { code: 'UNAUTHORIZED' },
        });

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
        throw new GraphQLError('게스트는 접근할 수 없는 기능입니다.', {
          extensions: { code: 'GUEST_UNAUTHENTICATED' },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(id)
      ).populate<{ sharingUsers: IUser[] }>('sharingUsers');

      const hasAccessTodaySkd = todaySchedule.author === user.id;
      const sharingUsers = todaySchedule.sharingUsers;
      const sharedTodaySkd = sharingUsers.filter(
        (follwer) => follwer.userId === user.id
      );

      const hasSharedTodaySkd = sharedTodaySkd.length !== 0 ? true : false;
      if (!(hasAccessTodaySkd || hasSharedTodaySkd))
        throw new GraphQLError('권한이 없습니다.', {
          extensions: { code: 'UNAUTHORIZED' },
        });

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
        throw new GraphQLError('게스트는 접근할 수 없는 기능입니다.', {
          extensions: { code: 'GUEST_UNAUTHENTICATED' },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(id)
      ).populate<{
        sharingUsers: IUser[];
      }>('sharingUsers');

      const hasAccessTodaySkd = todaySchedule.author === user.id;
      const sharingUsers = todaySchedule.sharingUsers;
      const sharedTodaySkd = sharingUsers.filter(
        (follwer) => follwer.userId === user.id
      );

      const hasSharedTodaySkd = sharedTodaySkd.length !== 0 ? true : false;
      if (!(hasAccessTodaySkd || hasSharedTodaySkd))
        throw new GraphQLError('권한이 없습니다.', {
          extensions: { code: 'UNAUTHORIZED' },
        });

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
        throw new GraphQLError('게스트는 접근할 수 없는 기능입니다.', {
          extensions: { code: 'GUEST_UNAUTHENTICATED' },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(id)
      ).populate<{
        sharingUsers: IUser[];
      }>('sharingUsers');

      const hasAccessTodaySkd = todaySchedule.author === user.id;
      const sharingUsers = todaySchedule.sharingUsers;
      const sharedTodaySkd = sharingUsers.filter(
        (follwer) => follwer.userId === user.id
      );

      const hasSharedTodaySkd = sharedTodaySkd.length !== 0 ? true : false;
      if (!(hasAccessTodaySkd || hasSharedTodaySkd))
        throw new GraphQLError('권한이 없습니다.', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      sharedTodaySkd;

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
        throw new GraphQLError('하루 일정을 찾을 수 없습니다.', {
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
      const loggedUser = await User.findUser(user.id);

      const todaySchedules = await TodaySkd.find()
        .or([
          { author: loggedUser.userId },
          { sharingUsers: { $in: [loggedUser._id] } },
        ])
        .populate<{ sharingUsers: IUser[] }>('sharingUsers');

      const finishedTodaySkd = todaySchedules.filter((todaySkd) =>
        todaySkd.toDos.every((toDo) => toDo.state === 'done')
      );

      if (!finishedTodaySkd)
        throw new GraphQLError('하루 일정을 찾을 수 없습니다.', {
          extensions: { code: 'NOT_FOUND' },
        });

      let outputDocedSchedule = [];

      for (let schedule of finishedTodaySkd) {
        const docedScheduleTemplate = {
          title: schedule.title,
          start: schedule.createdAt && new Date(schedule.createdAt),
          end:
            schedule.createdAt &&
            new Date(schedule.createdAt + 1000 * 60 * 60 * 24),
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

      finishedTodaySkd.map(
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
        throw new GraphQLError('게스트는 접근할 수 없는 기능입니다.', {
          extensions: { code: 'GUEST_UNAUTHENTICATED' },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(_id)
      ).populate<{
        sharingUsers: IUser[];
      }>('sharingUsers');

      if (!todaySchedule)
        throw new GraphQLError('하루 일정을 찾을 수 없습니다.', {
          extensions: { code: 'NOT_FOUND' },
        });
      const hasAccessTodaySkd = todaySchedule.author === user.id;
      const sharingUsers = todaySchedule.sharingUsers;
      const sharedTodaySkd = sharingUsers.filter(
        (follwer) => follwer.userId === user.id
      );

      const hasSharedTodaySkd = sharedTodaySkd.length !== 0 ? true : false;
      if (!(hasAccessTodaySkd || hasSharedTodaySkd))
        throw new GraphQLError('권한이 없습니다.', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      todaySchedule.title = title;
      await todaySchedule.save();
      return todaySchedule;
    },
  },
};
