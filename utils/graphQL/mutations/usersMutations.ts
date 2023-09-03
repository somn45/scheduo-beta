import { gql } from '@/generates/type';

export const ADD_USER = gql(`
mutation AddUser(
  $userId: String!
  $password: String!
  $name: String!
  $email: String
  $company: String
) {
  addUser(
    userId: $userId
    password: $password
    name: $name
    email: $email
    company: $company
  ) {
    ...UserList
  }
}
`);

export const CHECK_USER = gql(`
  mutation CheckUser($userId: String!, $password: String!) {
    checkUser(userId: $userId, password: $password) {
      userId
    }
  }
`);

export const ADD_FOLLOWER = gql(`
mutation AddFollower($id: String!) {
  addFollower(id: $id) {
    ...UserListIncludesId
  }
}
`);
