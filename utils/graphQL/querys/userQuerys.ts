import { gql } from '@/generates/type';

export const GET_USERS = gql(`
query GetUsers {
  allUsers {
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
query GetFollowers($userId: String!) {
  allFollowers(userId: $userId) {
    userId
  }
}
`);
