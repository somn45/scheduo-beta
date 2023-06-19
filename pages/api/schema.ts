import { makeExecutableSchema } from '@graphql-tools/schema';
import userTypeDefs from './user/user.typeDefs';
import userQueries from './user/user.queries';

const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs],
  resolvers: [userQueries],
});

export default schema;
