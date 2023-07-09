import User from '@/models/User';
import { ContextValue } from './users.mutations';
import { GraphQLError } from 'graphql';

export default {
  Query: {
    allUsers: async () => {
      const users = await User.findAllUsers();
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
    allFollowers: async (
      _: unknown,
      __: unknown,
      { cookies }: ContextValue
    ) => {
      const userId = cookies.get('uid');
      if (!userId)
        throw new GraphQLError('UserId not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const user = await User.findOne({ userId }).populate([
        {
          path: 'followers',
          transform: (doc) => {
            return doc === null
              ? null
              : {
                  userId: doc.userId,
                  email: doc.email,
                  company: doc.company,
                };
          },
        },
      ]);
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const followers = user.followers;
      return followers;
    },
  },
};
