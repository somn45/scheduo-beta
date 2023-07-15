import jwt from 'jsonwebtoken';
import { ContextValue } from '../users/users.mutations';

export default {
  Query: {
    getToken: (_: unknown, __: unknown, { req, cookies }: ContextValue) => {
      const accessToken = cookies.get('accessToken');
      if (!(req.session.user && accessToken)) return { accessToken: '' };
      const tokenSecretKey = process.env.NEXT_PUBLIC_JWT_SECRET
        ? process.env.NEXT_PUBLIC_JWT_SECRET
        : '';
      try {
        const verify = jwt.verify(accessToken, tokenSecretKey);
        return { accessToken };
      } catch (error) {
        console.log(error);
      }
    },
  },
};
