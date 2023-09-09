import { ObjectId } from 'mongoose';

export interface BasicUserField {
  userId: string;
  password: string;
  name: string;
}

export interface IUser extends BasicUserField {
  _id?: string;
  email?: string;
  company?: string;
  refreshToken?: string;
  expiredAt?: Date;
  followers: FollowerSearchItem[];
}

export type publicUserInfo = Pick<IUser, 'userId' | 'email' | 'company'>;

export type IUserWithoutID = Omit<IUser, '_id'>;

export interface DBUser extends Omit<IUserWithoutID, 'followers'> {
  followers: ObjectId[] | IUser[];
}

export interface FollowerSearchItem {
  userId: string;
  name: string;
}

export interface IFollowerPreview extends FollowerSearchItem {
  follow: boolean;
}

export interface IFollowers {
  userId: string;
  name: string;
  email: string;
  company: string;
}
