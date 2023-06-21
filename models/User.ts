import { Model, Schema, model, models } from 'mongoose';
import bcrypt from 'bcrypt';

interface DBUser {
  userId: string;
  password: string;
  email?: string;
  company?: string;
}

interface DBUserModel extends Model<DBUser> {}

const userSchema = new Schema<DBUser>(
  {
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    company: String,
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const saltRounds = 5;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const User =
  models.User<DBUser> || model<DBUser, DBUserModel>('User', userSchema);

export default User;
