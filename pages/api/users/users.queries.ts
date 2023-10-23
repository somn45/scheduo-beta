import User from '@/models/User';
import { ContextValue } from './users.mutations';
import { GraphQLError } from 'graphql';
import { IFollower } from '@/types/interfaces/users.interface';
import {
  GUEST_UNAUTHENTICATED_ERROR,
  USER_NOT_FOUND_ERROR,
} from '@/constants/apolloErrorMessages';
import { Types } from 'mongoose';

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
      const storedSessionUser = req.session.user;

      const user = await User.findOne({ userId }).populate<{
        followers: IFollower[];
      }>([
        {
          path: 'followers',
          transform: (doc: IFollower) => ({
            userId: doc.userId,
            name: doc.name,
            email: doc.email,
            company: doc.company,
          }),
        },
      ]);
      const followers = user?.followers;
      if (!user) {
        const user = await User.findOne({
          userId: storedSessionUser ? storedSessionUser.id : '',
        }).populate<{
          followers: IFollower[];
        }>([
          {
            path: 'followers',
            transform: (doc: IFollower) => ({
              userId: doc.userId,
              name: doc.name,
              email: doc.email,
              company: doc.company,
            }),
          },
        ]);
        if (!user)
          throw new GraphQLError(USER_NOT_FOUND_ERROR.message, {
            extensions: { code: USER_NOT_FOUND_ERROR.code },
          });
        const followers = user.followers;
        return followers;
      }
      return followers;
    },
    searchFollowers: async (
      _: unknown,
      { name }: { name: string },
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });
      const loggedUser = await User.findUser(storedSessionUser.id);
      const users = await User.find()
        .where('name')
        .equals(name)
        .where('userId')
        .ne(loggedUser.userId)
        .exec();
      return users;
    },
    searchFollowersById: async (
      _: unknown,
      { id }: { id: Types.ObjectId },
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });

      const users = await User.find()
        .where('_id')
        .equals(id)
        .where('userId')
        .ne(storedSessionUser.id)
        .exec();
      return users;
    },
  },
};
