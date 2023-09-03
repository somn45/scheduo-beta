import { gql } from '@/generates/type';
import request from 'graphql-request';
import { IUser } from '@/types/interfaces/users.interface';
import { GET_USERS, GET_USER_BY_Id } from '@/utils/graphQL/querys/userQuerys';

export default function User({ user }: { user: IUser }) {
  return (
    <section className="mt-10 flex flex-col justify-center items-center">
      <article className="w-96 h-40 mb-5 py-4 bg-white border-4 border-slate-300 rounded-lg flex flex-col items-center">
        <h1 className="text-xl font-semibold">사용자 정보</h1>
        <span className="text-sm text-slate-400">{user._id}</span>
      </article>
      <article className="w-96 mb-5 pt-4 px-4 bg-white border-4 border-slate-300 rounded-lg">
        <ul className="flex flex-col">
          <li className="w-full mb-8 flex flex-row justify-between">
            <h5 className="text-lg font-semibold">아이디 : </h5>
            <span className="text-lg text-slate-500">{user.userId}</span>
          </li>
          <li className="w-full mb-8 flex flex-row justify-between">
            <h5 className="text-lg font-semibold">이메일 : </h5>
            <span className="text-lg text-slate-500">
              {user.email ? user.email : '미등록'}
            </span>
          </li>
          <li className="w-full mb-8 flex flex-row justify-between">
            <h5 className="text-lg font-semibold">소속 기업 : </h5>
            <span className="text-lg text-slate-500">
              {user.company ? user.company : '미등록'}
            </span>
          </li>
        </ul>
      </article>
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
    GET_USER_BY_Id,
    { id: params.id }
  );
  return {
    props: {
      user: getUserData.getUserById,
    },
  };
}
