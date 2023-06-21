import User from '@/models/User';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';

interface IUser {
  userId: string;
  password: string;
  email?: string;
  company?: string;
}

export default {
  Mutation: {
    addUser: async (
      _: unknown,
      { userId, password, email, company }: IUser
    ) => {
      const signedUser = await User.findOne({ userId });
      if (signedUser)
        throw new GraphQLError('User already exists', {
          extensions: { code: 'BAD_REQUEST' },
        });
      await User.create({
        userId,
        password,
        email,
        company,
      });
      return { userId, email, company };
    },
    checkUser: async (_: unknown, { userId, password }: IUser) => {
      console.log(userId, password);
      const user: IUser | null = await User.findOne({ userId });
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });

      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword)
        throw new GraphQLError('Password not match', {
          extensions: { code: 'BAD_REQUEST' },
        });
      return { userId };
    },
  },
};
