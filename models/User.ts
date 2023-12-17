import {
  Document,
  Model,
  Types,
  Schema,
  models,
  QueryWithHelpers,
  HydratedDocument,
} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '@/pages/api/db';
import {
  IFollower,
  IUser,
  IUserWithoutID,
} from '@/types/interfaces/users.interface';

export interface DBUser extends Omit<IUserWithoutID, 'followers'> {
  followers: Types.ObjectId[];
  todaySchedules: Types.ObjectId[];
}

interface DBUserDocument extends DBUser, Document {
  getEmail: () => string;
  getFollowerList: () => IFollower[];
  getFollowerIds: () => Types.ObjectId[];
  checkPassword: (password: string) => boolean;
}

interface DBUserModel extends Model<DBUserDocument> {
  findAllUsers: () => Promise<DBUserDocument>;
  findUser: (userId: string) => Promise<DBUserDocument>;
  findUserById: (id: string) => Promise<DBUserDocument>;
}

const userSchema: Schema<DBUserDocument> = new Schema(
  {
    userId: {
      type: String,
      required: [true, '아이디는 필수 입력 요소입니다.'],
      unique: true,
      minlength: [
        6,
        '아이디의 글자 길이는 최소 {MINLENGTH} 글자이나 입력하신 아이디는 {VALUE} 입니다.',
      ],
      maxlength: [
        20,
        '아이디의 글자 길이는 최대 {MAXLENGTH} 글자이나 입력하신 아이디는 {VALUE} 입니다.',
      ],
    },
    password: {
      type: String,
      required: [true, '비밀번호는 필수 입력 요소입니다.'],
    },
    name: {
      type: String,
      required: [true, '이름은 필수 입력 요소입니다.'],
      minlength: [
        3,
        '이름의 글자 길이는 최소 {MINLENGTH} 글자이나 입력하신 이름는 {VALUE} 입니다.',
      ],
      maxlength: [
        5,
        '이름의 글자 길이는 최대 {MAXLENGTH} 글자이나 입력하신 이름는 {VALUE} 입니다.',
      ],
    },
    email: {
      type: String,
      validate: {
        validator: function (v?: string) {
          if (v && !/[a-z0-9]+@[a-z]+.[a-z]{2,3}/g.test(v)) return false;
          return true;
        },
        message: '이메일 형식(xxx@xxx.xxx)이 맞지 않습니다.',
      },
    },
    company: String,
    refreshToken: String,
    expiredAt: Date,
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    todaySchedules: [{ type: Schema.Types.ObjectId, ref: 'TodaySkd' }],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  const saltRounds = 5;
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

userSchema.methods.getEmail = function () {
  return this.email;
};

userSchema.methods.getFollowerList = function () {
  return this.followers;
};

userSchema.methods.getFollowerIds = function () {
  return this.followers;
};

userSchema.methods.checkPassword = async function (password: string) {
  const check = await bcrypt.compare(password, this.password);
  return check;
};

userSchema.statics.findAllUsers = async function () {
  return await this.find();
};

userSchema.statics.findUser = async function (userId: string) {
  return await this.findOne({ userId });
};

userSchema.statics.findUserById = async function (id: string) {
  return await this.findById(id);
};

const User =
  (models.User as DBUserModel) ||
  db.model<DBUserDocument, DBUserModel>('User', userSchema);

export default User;
