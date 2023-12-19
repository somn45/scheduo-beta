import User from '@/models/User';
import { GraphQLError } from 'graphql';
import Cookies from 'cookies';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongoose';
import {
  BasicUserField,
  IFollower,
  IUser,
} from '@/types/interfaces/users.interface';
import {
  GUEST_UNAUTHENTICATED_ERROR,
  UNAUTHORIZED_ERROR,
} from '@/constants/apolloErrorMessages';
import { TodayScheduleWithID } from '@/types/interfaces/todaySkds.interface';
import TodaySkd from '@/models/TodaySkd';

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

      const isMatchPassword = await user.checkPassword(password);
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
      return user;
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
    editUser: async (
      _: unknown,
      { _id, name, email, company }: IUser,
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });
      const userObjectId = _id ? _id : '';
      const user = await User.findUserById(userObjectId);

      user.name = name;
      user.email = email;
      user.company = company;
      const updatedUser = await user.save();
      return user;
    },

    editUserPassword: async (
      _: unknown,
      { _id, password }: IUser,
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });

      const userObjectId = _id ? _id : '';
      const user = await User.findUserById(userObjectId);

      user.password = password;
      await user.save();
      return user;
    },

    deleteUser: async (
      _: unknown,
      { _id, password }: IUser,
      { req, cookies }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });

      const userObjectId = _id ? _id : '';
      const user = await User.findUserById(userObjectId);

      const isMatchPassword = await user.checkPassword(password);
      if (!isMatchPassword)
        throw new GraphQLError('Password was not match', {
          extensions: { code: 'BAD_REQUEST' },
        });

      for (let todayScheduleId of user.todaySchedules) {
        const todaySchedule = await TodaySkd.findById(
          todayScheduleId
        ).populate<{ sharingUsers: IFollower[] }>('sharingUsers');
        if (!todaySchedule) return;

        if (user.userId === todaySchedule.author) {
          await todaySchedule.deleteOne({ _id: todayScheduleId });
        } else {
          const sharingUsersExceptDeletedUser =
            todaySchedule?.sharingUsers.filter((sharingUser) => {
              if (sharingUser.userId === user.userId) return false;
              return true;
            });
          todaySchedule.sharingUsers = sharingUsersExceptDeletedUser;
          await todaySchedule.save();
        }
      }

      await User.deleteOne({ userId: user.userId });

      req.session.destroy();
      cookies.set('accessToken');
      cookies.set('sid');
      return user;
    },

    addFollower: async (
      _: unknown,
      { userId, profileUserId }: { userId: string; profileUserId: string },
      { req }: ContextValue
    ) => {
      const loggedUserId = req.session.user?.id;
      if (!loggedUserId)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });
      if (profileUserId !== loggedUserId)
        throw new GraphQLError(UNAUTHORIZED_ERROR.message, {
          extensions: { code: UNAUTHORIZED_ERROR.code },
        });
      if (userId === loggedUserId)
        throw new GraphQLError('팔로워 대상이 로그인 된 계정입니다.', {
          extensions: { code: 'BAD_REQUEST' },
        });
      const loggedUser = await (
        await User.findUser(loggedUserId)
      ).populate<{ followers: IFollower[] }>('followers');

      const newFollower = await User.findUser(userId);
      if (!newFollower) return {};
      const followList = loggedUser.getFollowerList();

      const followerUserIds = followList.map((follower) => follower.userId);
      if (followerUserIds.includes(userId))
        throw new GraphQLError('이미 팔로우된 사용자입니다.', {
          extensions: { code: 'BAD_REQUEST' },
        });
      loggedUser.followers.push(newFollower);
      await loggedUser.save();
      return newFollower;
    },
    deleteFollower: async (
      _: unknown,
      {
        userId: followerId,
        profileUserId,
      }: { userId: string; profileUserId: string },
      { req }: ContextValue
    ) => {
      const storedSessionUser = req.session.user;
      if (!storedSessionUser)
        throw new GraphQLError(GUEST_UNAUTHENTICATED_ERROR.message, {
          extensions: { code: GUEST_UNAUTHENTICATED_ERROR.code },
        });
      const loggedUser = await User.findUser(storedSessionUser.id);
      if (profileUserId !== loggedUser._id.toString())
        throw new GraphQLError(UNAUTHORIZED_ERROR.message, {
          extensions: { code: UNAUTHORIZED_ERROR.code },
        });

      const user = await User.findUser(storedSessionUser.id);
      if (!user)
        throw new GraphQLError('로그인 중인 계정을 찾을 수 없습니다.', {
          extensions: { code: 'USER_NOT_FOUND' },
        });
      const follower = await User.findUser(followerId);
      const followerIds = user.getFollowerIds();
      const followedList = followerIds.filter((id) => {
        return id.toString() !== follower._id.toString() ? id : null;
      });
      await User.findOneAndUpdate(
        { userId: storedSessionUser.id },
        { followers: followedList }
      );
      return follower;
    },
  },
};
