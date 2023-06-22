import jwt from 'jsonwebtoken';
import { ContextValue } from '../users/users.mutations';

export default {
  Query: {
    getToken: (_: unknown, __: unknown, { cookies }: ContextValue) => {
      const accessToken = cookies.get('accessToken');
      try {
        if (accessToken) jwt.verify('accessToken', 'secret');
        return { accessToken };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
