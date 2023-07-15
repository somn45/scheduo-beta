import gql from 'graphql-tag';

export default gql`
  type Token {
    accessToken: String
    isSuccess: Boolean
  }
  type Query {
    getToken: Token
  }
  type Mutation {
    setToken: Token
  }
`;
