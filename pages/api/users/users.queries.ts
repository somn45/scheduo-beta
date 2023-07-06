import User from '@/models/User';
import { ContextValue } from './users.mutations';
import { GraphQLError } from 'graphql';

export default {
  Query: {
    allUsers: async () => {
      const users = await User.findAllUsers();
      console.log(users);
      return users;
    },
    getUser: async (_: unknown, __: unknown, { cookies }: ContextValue) => {
      const userId = cookies.get('uid');
      if (!userId)
        throw new GraphQLError('You are not an active user', {
          extensions: { code: 'UNAUTHORIZED' },
        });
      const user = await User.findUser(userId);
      return user;
    },
    getUserById: async (_: unknown, { id }: { id: string }) => {
      const user = await User.findUserById(id);
      return user;
    },
  },
};
