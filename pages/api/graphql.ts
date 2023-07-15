import '@/pages/api/db';
import { ApolloServer } from '@apollo/server';
import schema from './schema';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import Cookies from 'cookies';
import { withIronSessionApiRoute } from 'iron-session/next';
import { IronSessionOptions } from 'iron-session';

const options: IronSessionOptions = {
  cookieName: 'uid',
  password: process.env.NEXT_PUBLIC_SESSION_PASSWORD
    ? process.env.NEXT_PUBLIC_SESSION_PASSWORD
    : '',
};

const server = new ApolloServer({ schema });

const handler = startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    return { req, res, cookies: new Cookies(req, res) };
  },
});

export default withIronSessionApiRoute(handler, options);
