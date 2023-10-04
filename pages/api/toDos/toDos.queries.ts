import { GraphQLError } from 'graphql';
import { ContextValue } from '../users/users.mutations';
import TodaySkd from '@/models/TodaySkd';
import DocedTodaySkd from '@/models/DocedTodaySkd';

export default {
  Query: {
    allSchedules: async () => {
      const todaySchedule = await TodaySkd.find().populate('sharingUsers');
      return todaySchedule;
    },
    getSchedule: async (_: unknown, { id }: { id: string }) => {
      const todaySchedule = (await TodaySkd.findByIdTodaySkd(id)).populate(
        'sharingUsers'
      );
      return todaySchedule;
    },
    allToDos: async (_: unknown, __: unknown, { cookies }: ContextValue) => {
      const author = cookies.get('uid');
      if (!author)
        throw new GraphQLError('인증된 유저 없음', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      const todaySchedule = await TodaySkd.findTodaySkd(author);
      if (!todaySchedule.toDos) return [];
      return todaySchedule.toDos;
    },
    allDocedTodaySkds: async (
      _: unknown,
      __: unknown,
      { req }: ContextValue
    ) => {
      const { user } = req.session;
      if (!user) return;
      const docedTodaySkds = await DocedTodaySkd.find({ author: user.id });
      return docedTodaySkds;
    },
  },
};
