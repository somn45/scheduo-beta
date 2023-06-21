import '@/db';
import { ApolloServer } from '@apollo/server';
import schema from './schema';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

const server = new ApolloServer({ schema });

export default startServerAndCreateNextHandler(server);
