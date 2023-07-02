import User from '@/models/User';
import { ContextValue } from './users.mutations';

export default {
  Query: {
    allUsers: async () => {
      const users = await User.find();
      console.log(users);
      return users;
    },
    getUser: async (_: unknown, __: unknown, { cookies }: ContextValue) => {
      const userId = cookies.get('uid');
      const user = await User.findOne({ userId });
      return user;
    },
    getUserById: async (_: unknown, { id }: { id: string }) => {
      const user = await User.findById(id);
      return user;
    },
  },
};
