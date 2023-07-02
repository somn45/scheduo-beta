import { graphql } from '@/generates/type';
import request from 'graphql-request';
import { IUser } from '../api/users/users.mutations';

const GET_USERS = graphql(`
  query GetUsers {
    allUsers {
      _id
      userId
      email
      company
    }
  }
`);

const GET_USER_BY_ID = graphql(`
  query GetUserById($id: String!) {
    getUserById(id: $id) {
      _id
      userId
      email
      company
    }
  }
`);

export default function User({ user }: { user: IUser }) {
  return (
    <section>
      <h2>사용자 정보</h2>
      <span>{user._id}</span>
      <ul>
        <li>
          <h5>아이디 : </h5>
          <span>{user.userId}</span>
        </li>
        <li>
          <h5>이메일 : </h5>
          <span>{user.email ? user.email : '미등록'}</span>
        </li>
        <li>
          <h5>소속 기업 : </h5>
          <span>{user.company ? user.company : '미등록'}</span>
        </li>
      </ul>
    </section>
  );
}

export async function getStaticPaths() {
  const allUsersData = await request(
    'http://localhost:3000/api/graphql',
    GET_USERS
  );
  const paths = allUsersData.allUsers.map((user) => ({
    params: {
      id: user._id,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const getUserData = await request(
    'http://localhost:3000/api/graphql',
    GET_USER_BY_ID,
    { id: params.id }
  );
  return {
    props: {
      user: getUserData.getUserById,
    },
  };
}
