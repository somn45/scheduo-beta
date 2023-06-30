import '@/db';
import { ApolloServer } from '@apollo/server';
import schema from './schema';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import Cookies from 'cookies';

const server = new ApolloServer({ schema });

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    let accessToken = '';
    const cookies = new Cookies(req, res);
    const userId = cookies.get('uid');
    if (userId) {
      const authHeader = req.headers['authorization'];
      if (authHeader) accessToken = authHeader.substring(7, authHeader.length);
    }
    return { req, res, cookies };
  },
});
