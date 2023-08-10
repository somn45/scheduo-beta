import User from '@/models/User';
import { ContextValue, IUser } from '../users/users.mutations';
import jwt from 'jsonwebtoken';

export interface UserId {
  userId: string;
}

const ACCESS_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60;

export default {
  Mutation: {
    setToken: async (
      _: unknown,
      __: unknown,
      { req, cookies }: ContextValue
    ) => {
      const loggedUser = req.session.user;
      if (!loggedUser) return { isSuccess: false };
      const userId = loggedUser.id;
      const user = await User.findUser(userId);
      if (!user) return { isSuccess: false };
      if (user && !user.refreshToken) return { isSuccess: false };
      const { expiredAt } = user;
      if (expiredAt && new Date(expiredAt) < new Date(Date.now()))
        return { isSuccess: false };

      const tokenSecretKey = process.env.JWT_SECRET
        ? process.env.JWT_SECRET
        : '';
      const accessToken = jwt.sign({ userId }, tokenSecretKey);
      cookies.set('accessToken', accessToken, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
      });
      return { accessToken, isSuccess: true };
    },
  },
};
