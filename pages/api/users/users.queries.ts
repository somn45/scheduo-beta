import User from '@/models/User';
import { ContextValue } from './users.mutations';
import { GraphQLError } from 'graphql';
import { IFollower } from '@/types/interfaces/users.interface';

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
        const loggedUser = req.session.user;
        if (!loggedUser)
          throw new GraphQLError('게스트로 접근할 수 없는 기능입니다.', {
            extensions: { code: 'GUEST_UNAUTHENTICATED' },
          });
        const user = await User.findOne({ userId: loggedUser.id }).populate<{
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
          throw new GraphQLError('계정을 찾을 수 없습니다.', {
            extensions: { code: 'NOT_FOUND' },
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
        throw new GraphQLError('게스트로 접근할 수 없는 기능입니다.', {
          extensions: { code: 'GUEST_UNAUTHENTICATED' },
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
      { id }: { id: string },
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError('게스트로 접근할 수 없는 기능입니다.', {
          extensions: { code: 'GUEST_UNAUTHENTICATED' },
        });

      const users = await User.find()
        .where('_id')
        .equals(id)
        .where('userId')
        .ne(storedSessionUser.id)
        .exec();
      console.log(users);
      return users;
    },
  },
};
