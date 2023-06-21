import { makeExecutableSchema } from '@graphql-tools/schema';
import userTypeDefs from './users/users.typeDefs';
import userQueries from './users/users.queries';
import usersMutations from './users/users.mutations';

const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs],
  resolvers: [userQueries, usersMutations],
});

export default schema;
