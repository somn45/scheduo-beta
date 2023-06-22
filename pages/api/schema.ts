import { makeExecutableSchema } from '@graphql-tools/schema';
import userTypeDefs from './users/users.typeDefs';
import userQueries from './users/users.queries';
import usersMutations from './users/users.mutations';
import cookiesTypeDefs from './cookies/cookies.typeDefs';
import cookiesQueries from './cookies/cookies.queries';
import cookiesMutations from './cookies/cookies.mutations';

const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs, cookiesTypeDefs],
  resolvers: [userQueries, usersMutations, cookiesQueries, cookiesMutations],
});

export default schema;
