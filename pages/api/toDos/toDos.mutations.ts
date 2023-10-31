import { GraphQLError } from 'graphql';
import { ContextValue } from '../users/users.mutations';
import DocedTodaySkd from '@/models/DocedTodaySkd';
import TodaySkd from '@/models/TodaySkd';
import {
  IToDo,
  todayScheduleWithoutState,
  todaySchedulePreview,
  todayScheduleUniqueField,
  UpdateToDoStateProps,
} from '@/types/interfaces/todaySkds.interface';
import { IFollower, IUser } from '@/types/interfaces/users.interface';
import User from '@/models/User';
import checkAuthorizeTodaySchedule from '@/utils/methods/checkAuthorize';
import {
  GUEST_UNAUTHENTICATED_ERROR,
  TODAY_SCHEDULE_NOT_FOUND_ERROR,
  UNAUTHORIZED_ERROR,
} from '@/constants/apolloErrorMessages';
import setTodayStateWillDone from '@/utils/methods/setTodaySkdState/setTodaySkdStateWillDone';
import setTodayStateToDo from '@/utils/methods/setTodaySkdState/setTodaySkdStateToDo';
import findIsCheckedStateNextDay from '@/utils/methods/findIsCheckedStateNextDay/findIsCheckedStateNextDay';
import createDocumentedTodaySchedule from '@/utils/methods/createDocumentedTodaySchedule/createDocumentedTodaySchedule';
import getCurrentDay from '@/utils/methods/getDate/getCurrentDay';

interface CreateScheduleWithSharingUsersProps {
  title: string;
  followers: IFollower[];
}

export default {
  Mutation: {
    createSchedule: async (
      _: unknown,
      { title }: todaySchedulePreview,
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });
      const author = storedSessionUser.id;

      const newTodaySkd = await TodaySkd.create({
        title,
        author,
      });
      return newTodaySkd;
    },
    createScheduleWithFollowers: async (
      _: unknown,
      { title, followers }: CreateScheduleWithSharingUsersProps,
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });
      const author = storedSessionUser.id;

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
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(_id)
      ).populate<{ sharingUsers: IUser[] }>('sharingUsers');
      if (!todaySchedule)
        throw new GraphQLError(TODAY_SCHEDULE_NOT_FOUND_ERROR.message, {
          extensions: { code: TODAY_SCHEDULE_NOT_FOUND_ERROR.code },
        });

      const hasAccessTodaySkd = checkAuthorizeTodaySchedule(
        todaySchedule,
        storedSessionUser
      );
      if (!hasAccessTodaySkd)
        throw new GraphQLError(UNAUTHORIZED_ERROR.message, {
          extensions: { code: UNAUTHORIZED_ERROR.code },
        });

      todaySchedule.deleteOne();
      return todaySchedule;
    },
    addToDo: async (
      _: unknown,
      { input }: { input: todayScheduleWithoutState },
      { req }: ContextValue
    ) => {
      const { id, content, updatedAt, registeredAt } = input;
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(id)
      ).populate<{ sharingUsers: IUser[] }>('sharingUsers');

      const hasAccessTodaySkd = checkAuthorizeTodaySchedule(
        todaySchedule,
        storedSessionUser
      );
      if (!hasAccessTodaySkd)
        throw new GraphQLError(UNAUTHORIZED_ERROR.message, {
          extensions: { code: UNAUTHORIZED_ERROR.code },
        });

      todaySchedule.toDos.push({
        content,
        registeredAt,
        updatedAt,
        state: 'toDo',
      });
      await todaySchedule.save();
      return { content, registeredAt, updatedAt, state: 'toDo' };
    },
    updateToDo: async (
      _: unknown,
      { input }: { input: todayScheduleWithoutState },
      { req }: ContextValue
    ) => {
      const { id, content, registeredAt, updatedAt } = input;
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(id)
      ).populate<{ sharingUsers: IUser[] }>('sharingUsers');

      const hasAccessTodaySkd = checkAuthorizeTodaySchedule(
        todaySchedule,
        storedSessionUser
      );
      if (!hasAccessTodaySkd)
        throw new GraphQLError(UNAUTHORIZED_ERROR.message, {
          extensions: { code: UNAUTHORIZED_ERROR.code },
        });

      const { toDos } = todaySchedule;

      const updateToDo: IToDo = {
        content,
        registeredAt,
        updatedAt,
        state: 'toDo',
      };
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
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(id)
      ).populate<{
        sharingUsers: IUser[];
      }>('sharingUsers');

      const hasAccessTodaySkd = checkAuthorizeTodaySchedule(
        todaySchedule,
        storedSessionUser
      );
      if (!hasAccessTodaySkd)
        throw new GraphQLError(UNAUTHORIZED_ERROR.message, {
          extensions: { code: UNAUTHORIZED_ERROR.code },
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
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(id)
      ).populate<{
        sharingUsers: IUser[];
      }>('sharingUsers');

      const hasAccessTodaySkd = checkAuthorizeTodaySchedule(
        todaySchedule,
        storedSessionUser
      );
      if (!hasAccessTodaySkd)
        throw new GraphQLError(UNAUTHORIZED_ERROR.message, {
          extensions: { code: UNAUTHORIZED_ERROR.code },
        });

      const updatedToDos = hasFinished
        ? setTodayStateWillDone(todaySchedule, registeredAt)
        : setTodayStateToDo(todaySchedule, registeredAt);

      todaySchedule.toDos = updatedToDos;
      await todaySchedule.save();
      return updatedToDos;
    },
    finishToDos: async (
      _: unknown,
      { title }: todaySchedulePreview,
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser) return;

      const todayScheduleDocument = await TodaySkd.findOne({ title });
      if (!todayScheduleDocument)
        throw new GraphQLError(TODAY_SCHEDULE_NOT_FOUND_ERROR.message, {
          extensions: { code: TODAY_SCHEDULE_NOT_FOUND_ERROR.code },
        });
      if (todayScheduleDocument.toDos.length === 0) return [];

      const toDos = todayScheduleDocument.toDos;

      const currentDaysharp = getCurrentDay();
      const partialFinishedToDos = findIsCheckedStateNextDay(
        toDos,
        currentDaysharp
      );

      todayScheduleDocument.toDos = [...partialFinishedToDos];
      await todayScheduleDocument.save();

      return partialFinishedToDos;
    },
    documentedToDos: async (_: unknown, __: unknown, { req }: ContextValue) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser) return null;

      const loggedUser = await User.findUser(storedSessionUser.id);
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
        throw new GraphQLError(TODAY_SCHEDULE_NOT_FOUND_ERROR.message, {
          extensions: { code: TODAY_SCHEDULE_NOT_FOUND_ERROR.code },
        });

      const outputDocedSchedule = finishedTodaySkd.map(async (schedule) => {
        const doumentedSchedule = createDocumentedTodaySchedule(schedule);
        await DocedTodaySkd.insertMany(doumentedSchedule);
      });

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
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });

      const todaySchedule = await (
        await TodaySkd.findByIdTodaySkd(_id)
      ).populate<{
        sharingUsers: IUser[];
      }>('sharingUsers');

      if (!todaySchedule)
        throw new GraphQLError(TODAY_SCHEDULE_NOT_FOUND_ERROR.message, {
          extensions: { code: TODAY_SCHEDULE_NOT_FOUND_ERROR.code },
        });
      const hasAccessTodaySkd = checkAuthorizeTodaySchedule(
        todaySchedule,
        storedSessionUser
      );
      if (!hasAccessTodaySkd)
        throw new GraphQLError(UNAUTHORIZED_ERROR.message, {
          extensions: { code: UNAUTHORIZED_ERROR.code },
        });
      todaySchedule.title = title;
      await todaySchedule.save();
      return todaySchedule;
    },
  },
};
