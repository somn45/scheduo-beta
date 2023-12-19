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
      ...UserListIncludesId
    }
  }
`);

export const EDIT_USER = gql(`
  mutation EditUser($_id: String!, $name: String!, $email: String, $company: String) {
    editUser(_id: $_id, name: $name, email: $email, company: $company) {
      _id
      name
      email
      company
    }
  }
`);

export const DELETE_USER = gql(`
  mutation DeleteUser($_id: String! $password: String!) {
    deleteUser(_id: $_id, password: $password) {
      _id
      userId
    }
  }
`);

export const EDIT_USER_PASSWORD = gql(`
  mutation EditUserPassword($_id: String! $password: String!) {
    editUserPassword(_id: $_id, password: $password) {
      _id
      userId
    }
  }
`);

export const ADD_FOLLOWER = gql(`
mutation AddFollower($userId: String!, $profileUserId: String!) {
  addFollower(userId: $userId, profileUserId: $profileUserId) {
    ...UserListIncludesId
  }
}
`);

export const DELETE_FOLLOWER = gql(`
  mutation DeleteFollower($userId: String!, $profileUserId: String!) {
    deleteFollower(userId: $userId, profileUserId: $profileUserId) {
      ...UserList
    }
  }
`);
