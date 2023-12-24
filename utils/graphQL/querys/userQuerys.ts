import { gql } from '@/generates/type';

export const GET_USERS = gql(`
query GetUsers {
  allUsers {
    ...UserListIncludesId
  }
}
`);

export const GET_USER = gql(`
  query GetUser {
    getUser {
      ...UserListIncludesId
    }
  }
`);

export const GET_USER_BY_Id = gql(`
query GetUserById($id: String!) {
  getUserById(id: $id) {
    ...UserListIncludesId
  }
}
`);

export const ALL_FOLLOWERS = gql(`
query GetFollowers($userId: String) {
  allFollowers(userId: $userId) {
    _id
    userId
    name
    email
    company
  }
}
`);

export const SEARCH_FOLLOWERS = gql(`
  query SearchFollowers($name: String!) {
    searchFollowers(name: $name) {
      ...UserListIncludesId
    }
  }
`);

export const SEARCH_FOLLOWERS_BY_ID = gql(`
  query SearchFollowersById($id: String!) {
    searchFollowersById(id: $id) {
      ...UserListIncludesId
    }
  }
`);

export const CHECK_CURRENT_PASSWORD = gql(`
  query CheckCurrentPassword($_id: String!, $password: String!) {
    checkCurrentPassword(_id: $_id, password: $password) {
      ...UserListIncludesId
    }
  }
`);
