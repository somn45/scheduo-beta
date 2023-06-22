import User from '@/models/User';
import { GraphQLError } from 'graphql';
import bcrypt from 'bcrypt';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export interface IUser {
  userId: string;
  password: string;
  email?: string;
  company?: string;
  refreshToken?: string;
  expiredAt?: Date;
}

export interface ContextValue {
  req: NextApiRequest;
  res: NextApiResponse;
  cookies: Cookies;
}

const ACCESS_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60;
const REFRESH_TOKEN_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7;

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
    checkUser: async (
      _: unknown,
      { userId, password }: IUser,
      { req, res, cookies }: ContextValue
    ) => {
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

      const accessToken = jwt.sign(
        { userId },
        process.env.NEXT_PUBLIC_JWT_SECRET
          ? process.env.NEXT_PUBLIC_JWT_SECRET
          : ''
      );
      const refreshToken = jwt.sign(
        { userId },
        process.env.NEXT_PUBLIC_JWT_SECRET
          ? process.env.NEXT_PUBLIC_JWT_SECRET
          : ''
      );
      cookies.set('accessToken', accessToken, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
      });

      await User.findOneAndUpdate(
        { userId },
        {
          refreshToken,
          expiredAt: Date.now() + REFRESH_TOKEN_EXPIRATION_TIME,
        },
        { new: true, upsert: true }
      );

      return { userId };
    },
  },
};
