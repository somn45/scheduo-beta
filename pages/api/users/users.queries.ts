import User from '@/models/User';
import { ContextValue } from './users.mutations';
import { GraphQLError } from 'graphql';

export default {
  Query: {
    allUsers: async () => {
      const users = await User.findAllUsers();
      return users;
    },
    getUser: async (_: unknown, __: unknown, { req }: ContextValue) => {
      const userId = req.session.user?.id;
      if (userId) {
        const user = await User.findUser(userId);
        return user;
      }
    },
    getUserById: async (_: unknown, { id }: { id: string }) => {
      const user = await User.findUserById(id);
      return user;
    },
    allFollowers: async (
      _: unknown,
      { userId }: { userId: string },
      { req }: ContextValue
    ) => {
      const user = await User.findOne({ userId }).populate([
        {
          path: 'followers',
          transform: (doc) => ({
            userId: doc.userId,
            name: doc.name,
            email: doc.email,
            company: doc.company,
          }),
        },
      ]);
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const followers = user.followers;
      return followers;
    },
    searchFollowers: async (
      _: unknown,
      { name }: { name: string },
      { req }: ContextValue
    ) => {
      const users = await User.find({ name });
      return users;
    },
    searchFollowersById: async (
      _: unknown,
      { id }: { id: string },
      { req }: ContextValue
    ) => {
      const users = await User.findUserById(id);
      return users;
    },
  },
};
