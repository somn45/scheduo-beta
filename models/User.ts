import { Document, Model, ObjectId, Schema, models } from 'mongoose';
import bcrypt from 'bcrypt';
import db from '@/pages/api/db';
import { DBUser } from '@/types/interfaces/users.interface';

interface DBUserDocument extends DBUser, Document {
  getEmail: () => string;
  checkPassword: (password: string) => boolean;
}

interface DBUserModel extends Model<DBUserDocument> {
  findAllUsers: () => Promise<DBUserDocument>;
  findUser: (userId: string) => Promise<DBUserDocument>;
  findUserById: (id: string) => Promise<DBUserDocument>;
}

const userSchema: Schema<DBUserDocument> = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: String,
    company: String,
    refreshToken: String,
    expiredAt: Date,
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const saltRounds = 5;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.getEmail = function () {
  return this.email;
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
