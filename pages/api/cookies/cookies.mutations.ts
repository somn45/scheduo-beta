import User from '@/models/User';
import { ContextValue, IUser } from '../users/users.mutations';
import jwt from 'jsonwebtoken';

interface UserId {
  userId: string;
}

const ACCESS_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60;

export default {
  Mutation: {
    setToken: async (
      _: unknown,
      { userId }: UserId,
      { cookies }: ContextValue
    ) => {
      const user: IUser | null = await User.findOne({ userId });
      if (!user) return { isSuccess: false };
      if (user && !user.refreshToken) return { isSuccess: false };
      const { expiredAt } = user;
      if (expiredAt && new Date(expiredAt) < new Date(Date.now()))
        return { isSuccess: false };

      const accessToken = jwt.sign(
        { userId },
        process.env.NEXT_PUBLIC_JWT_SECRET
          ? process.env.NEXT_PUBLIC_JWT_SECRET
          : ''
      );
      cookies.set('accessToken', accessToken, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
      });
      return { accessToken, isSuccess: true };
    },
  },
};
