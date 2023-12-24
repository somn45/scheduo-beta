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
import { IFollower } from '@/types/interfaces/users.interface';
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

      const user = await User.findUser(author);
      user.todaySchedules.push(newTodaySkd._id);
      await user.save();
      for (let follower of followers) {
        const sharingUser = await User.findUser(follower.userId);
        sharingUser.todaySchedules.push(newTodaySkd._id);
        await sharingUser.save();
      }

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
      ).populate<{ sharingUsers: IFollower[] }>('sharingUsers');
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

      const author = await User.findUser(todaySchedule.author);
      author.todaySchedules = author.todaySchedules.filter((objectId) =>
        objectId.equals(todaySchedule._id) ? false : true
      );
      await author.save();

      for (let sharingUser of todaySchedule.sharingUsers) {
        const user = await User.findUser(sharingUser.userId);
        user.todaySchedules = user.todaySchedules.filter((objectid) => {
          return objectid.equals(todaySchedule._id) ? false : true;
        });
        await user.save();
      }

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
      ).populate<{ sharingUsers: IFollower[] }>('sharingUsers');

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
      ).populate<{ sharingUsers: IFollower[] }>('sharingUsers');

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
        sharingUsers: IFollower[];
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
        sharingUsers: IFollower[];
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
    documentedToDos: async (
      _: unknown,
      { userId }: { userId: string },
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      const loggedUserId = storedSessionUser ? storedSessionUser.id : userId;

      const loggedUser = await User.findUser(loggedUserId);
      const todaySchedules = await TodaySkd.find()
        .or([
          { author: loggedUser.userId },
          { sharingUsers: { $in: [loggedUser._id] } },
        ])
        .populate<{ sharingUsers: IFollower[] }>('sharingUsers');

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
        return doumentedSchedule;
      });

      for (let schedule of finishedTodaySkd) {
        const sharingUsers = schedule.sharingUsers;
        const author = await User.findUser(schedule.author);
        author.todaySchedules = author.todaySchedules.filter((objectId) =>
          objectId.equals(schedule._id) ? false : true
        );
        await author.save();

        for (let sharingUser of sharingUsers) {
          const user = await User.findUserById(
            sharingUser._id ? sharingUser._id : ''
          );
          user.todaySchedules = user.todaySchedules.filter((objectId) =>
            objectId.equals(schedule._id) ? false : true
          );
          await user.save();
        }
        await TodaySkd.deleteOne({ _id: schedule._id });
      }

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
        sharingUsers: IFollower[];
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
    updateSharingUsers: async (
      _: unknown,
      {
        _id,
        sharingUsers,
      }: {
        _id: string;
        sharingUsers: IFollower[];
      },
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
        sharingUsers: IFollower[];
      }>('sharingUsers');

      if (!todaySchedule)
        throw new GraphQLError(TODAY_SCHEDULE_NOT_FOUND_ERROR.message, {
          extensions: { code: TODAY_SCHEDULE_NOT_FOUND_ERROR.code },
        });

      todaySchedule.sharingUsers = [...sharingUsers];
      const saved = await (
        await todaySchedule.save()
      ).populate<{
        sharingUsers: IFollower[];
      }>('sharingUsers');
      return saved;
    },
  },
};
