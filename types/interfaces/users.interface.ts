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
}

export type publicUserInfo = Pick<IUser, 'userId' | 'email' | 'company'>;

export type IUserWithoutID = Omit<IUser, '_id'>;

export interface DBUser extends IUserWithoutID {
  followers: ObjectId[] | IUser[];
}
