import { ContextValue } from './users.mutations';

const USER_LIST = [{ userId: 'kim' }, { userId: 'chae' }];

export default {
  Query: {
    allUsers: (_: unknown, __: unknown, { cookies }: ContextValue) => {
      return USER_LIST;
    },
  },
};
