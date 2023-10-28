interface GraphQLQueryWithTypename {
  __typename?: string;
}

const removeGraphQLTypename = <T extends GraphQLQueryWithTypename>(
  graphQLQuery: T
): Omit<T, '__typename'> => {
  const { __typename, ...removedgraphQLQueryTypename } = graphQLQuery;
  return removedgraphQLQueryTypename;
};

export default removeGraphQLTypename;
