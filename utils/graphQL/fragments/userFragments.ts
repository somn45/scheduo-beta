import { gql } from '@/generates/type';

const USER_LIST = gql(`
  fragment UserList on User {
    userId
    email
    company
  }
`);

const USER_LIST_INCLUDES_ID = gql(`
  fragment UserListIncludesId on User {
    _id
    ...UserList
  }
`);
