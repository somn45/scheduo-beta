import { GraphQLError } from 'graphql';
import { ContextValue } from '../users/users.mutations';
import TodaySkd from '@/models/TodaySkd';
import DocedTodaySkd from '@/models/DocedTodaySkd';
import { IUser } from '@/types/interfaces/users.interface';
import { GUEST_UNAUTHENTICATED_ERROR } from '@/constants/apolloErrorMessages';

export default {
  Query: {
    allSchedules: async () => {
      const todaySchedule = await TodaySkd.find().populate<{
        sharingUsers: IUser[];
      }>('sharingUsers');
      return todaySchedule;
    },
    getSchedule: async (_: unknown, { id }: { id: string }) => {
      const todaySchedule = (await TodaySkd.findByIdTodaySkd(id)).populate<{
        sharingUsers: IUser[];
      }>('sharingUsers');
      return todaySchedule;
    },
    allDocedTodaySkds: async (
      _: unknown,
      __: unknown,
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });

      const docedTodaySkds = await DocedTodaySkd.find({
        author: storedSessionUser.id,
      });
      return docedTodaySkds;
    },
  },
};
