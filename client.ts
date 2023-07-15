import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { getCookie, deleteCookie } from 'cookies-next';
import request, { gql } from 'graphql-request';

interface GetTokenResponse {
  getToken: {
    accessToken?: string;
  };
}

interface SetTokenResponse {
  setToken: {
    accessToken?: string;
    isSuccess?: boolean;
  };
}

const GET_TOKEN = gql`
  query GetToken {
    getToken {
      accessToken
    }
  }
`;

const SET_TOKEN = gql`
  mutation SetToken {
    setToken {
      accessToken
      isSuccess
    }
  }
`;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const authLink = setContext(async (_, { headers }) => {
  let accessToken;
  const getTokenData = await request<GetTokenResponse>(
    'http://localhost:3000/api/graphql',
    GET_TOKEN
  );
  console.log(getTokenData);
  if (!getTokenData.getToken) return;
  accessToken = getTokenData.getToken.accessToken;
  if (!accessToken) {
    const setTokenData = await request<SetTokenResponse>(
      'http://localhost:3000/api/graphql',
      SET_TOKEN
    );
    if (!setTokenData.setToken.isSuccess) return deleteCookie('uid');
    accessToken = setTokenData.setToken.accessToken;
  }
  return {
    ...headers,
    authorization: accessToken ? `Bearer ${accessToken}` : '',
  };
});

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/api/graphql',
  credentials: 'include',
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, authLink, httpLink]),
});

export default client;
