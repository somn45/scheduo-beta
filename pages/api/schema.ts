import { makeExecutableSchema } from '@graphql-tools/schema';
import userTypeDefs from './users/users.typeDefs';
import userQueries from './users/users.queries';
import usersMutations from './users/users.mutations';
import cookiesTypeDefs from './cookies/cookies.typeDefs';
import cookiesQueries from './cookies/cookies.queries';
import cookiesMutations from './cookies/cookies.mutations';
import toDosTypeDefs from './toDos/toDos.typeDefs';
import toDosMutations from './toDos/toDos.mutations';
import toDosQueries from './toDos/toDos.queries';

const schema = makeExecutableSchema({
  typeDefs: [userTypeDefs, cookiesTypeDefs, toDosTypeDefs],
  resolvers: [
    userQueries,
    usersMutations,
    cookiesQueries,
    cookiesMutations,
    toDosQueries,
    toDosMutations,
  ],
});

export default schema;
