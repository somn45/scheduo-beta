import User from '@/models/User';
import { GraphQLError } from 'graphql';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongoose';
import { BasicUserField, IUser } from '@/types/interfaces/users.interface';

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
      { userId, password, name, email, company }: IUser
    ) => {
      const signedUser = await User.findUser(userId);
      if (signedUser)
        throw new GraphQLError('User already exists', {
          extensions: { code: 'BAD_REQUEST' },
        });
      await User.create({
        userId,
        password,
        name,
        email,
        company,
      });
      return { userId, name, email, company };
    },
    checkUser: async (
      _: unknown,
      { userId, password }: BasicUserField,
      { req, cookies }: ContextValue
    ) => {
      if (req.session.user)
        throw new GraphQLError('이미 로그인 된 사용자입니다.', {
          extensions: { code: 'BAD_REQUEST' },
        });

      const user = await User.findUser(userId);
      if (!user)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });

      const isMatchPassword = user.checkPassword(password);
      if (!isMatchPassword)
        throw new GraphQLError('Password not match', {
          extensions: { code: 'BAD_REQUEST' },
        });

      const tokenSecretKey = process.env.JWT_SECRET
        ? process.env.JWT_SECRET
        : '';
      const accessToken = jwt.sign({ userId }, tokenSecretKey);
      const refreshToken = jwt.sign({ userId }, tokenSecretKey);
      cookies.set('accessToken', accessToken, {
        httpOnly: true,
        maxAge: ACCESS_TOKEN_EXPIRATION_TIME,
      });

      user.refreshToken = refreshToken;
      user.expiredAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_TIME);
      await user.save();

      req.session.user = {
        id: userId,
      };
      await req.session.save();
      return { userId };
    },
    logout: async (_: unknown, __: unknown, { req, cookies }: ContextValue) => {
      const userId = req.session.user?.id;
      if (!userId)
        throw new GraphQLError('이미 로그아웃 된 사용자입니다.', {
          extensions: { code: 'BAD_REQUEST' },
        });
      req.session.destroy();
      cookies.set('accessToken');
      cookies.set('sid');
      return { userId };
    },
    addFollower: async (
      _: unknown,
      { userId }: { userId: string },
      { req }: ContextValue
    ) => {
      const loggedUserId = req.session.user?.id;
      if (!loggedUserId)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });

      const loggedUser = await (
        await User.findUser(loggedUserId)
      ).populate('followers');
      if (!loggedUser)
        throw new GraphQLError('User not found', {
          extensions: { code: 'NOT_FOUND' },
        });
      const newFollower = (await User.findUser(userId)) as IUser;
      if (!newFollower) return {};
      const followList = loggedUser.followers as IUser[];

      const followerUserIds = followList.map((follower) => follower.userId);
      if (followerUserIds.includes(userId))
        throw new GraphQLError('Already followed', {
          extensions: { code: 'BAD_REQUEST' },
        });
      loggedUser.followers = [...followList, newFollower];
      await loggedUser.save();
      return newFollower;
    },
    deleteFollower: async (
      _: unknown,
      { userId: followerId }: Pick<BasicUserField, 'userId'>,
      { req }: ContextValue
    ) => {
      const userId = req.session.user?.id;
      if (!userId)
        throw new GraphQLError('UserId not found', {
          extensions: { code: 'NOT_FOUND' },
        });

      const user = await User.findOne({ userId });
      const follower = await User.findUser(followerId);
      const followerIds = user?.followers as ObjectId[];
      const followedList: ObjectId[] = followerIds.filter((id) => {
        return id.toString() !== follower._id.toString() ? id : null;
      });
      await User.findOneAndUpdate({ userId }, { followers: followedList });
      return follower;
    },
  },
};
