import '@/pages/api/db';
import { ApolloServer } from '@apollo/server';
import schema from './schema';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import Cookies from 'cookies';

const server = new ApolloServer({ schema });

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    return { req, res, cookies: new Cookies(req, res) };
  },
});
