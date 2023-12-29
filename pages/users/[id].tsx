import request from 'graphql-request';
import { IFollower, IUser } from '@/types/interfaces/users.interface';
import {
  ALL_FOLLOWERS,
  GET_USERS,
  GET_USER_BY_Id,
} from '@/utils/graphQL/querys/userQuerys';
import { useSelector } from 'react-redux';
import {
  RootState,
  initFollowerReducer,
  useAppDispatch,
} from '@/lib/store/store';
import { useEffect, useState } from 'react';
import UserProfile from '@/components/users/([id])/user-profile';
import MyFollowerList from '@/components/users/([id])/my-follower-list/my-follower-list';
import SearchFollowerModel from '@/components/users/([id])/search-follower/search-follower.model';
import Link from 'next/link';

interface UserProfileProps {
  user: IUser;
  myFollowers: IFollower[];
}

export default function User({ user, myFollowers }: UserProfileProps) {
  const [showsFollowModal, setShowsFollowModal] = useState(false);
  const followers = useSelector((state: RootState) => state.followers);
  const dispatch = useAppDispatch();

  return (
    <section className="mt-10 flex flex-col lg:flex-row">
      <article
        className="lg:w-1/2 py-5 
      border-b-2 lg:border-b-0 lg:border-r-2 border-dotted
      flex flex-col items-center
      "
      >
        <UserProfile user={user} />
        <div className="w-1/2 flex justify-between">
          <Link href={`/users/${user._id}/edit`}>
            <h5
              className="px-3 py-2 bg-slate-300 border-2 rounded-md 
            text-sm font-semibold text-slate-700
            flex jusitfy-center items-center
            hover:bg-slate-400 focus:bg-slate-400 transition ease-in-out"
            >
              수정
            </h5>
          </Link>
          <Link href={`/users/${user._id}/delete`}>
            <h5
              className="px-3 py-2 bg-red-400 rounded-md text-white
            flex jusitfy-center items-center
            hover:bg-red-600 focus:bg-red-600 transition ease-in-out"
            >
              삭제
            </h5>
          </Link>
        </div>
      </article>
      <article className="lg:w-1/2 py-5 flex flex-col items-center">
        <MyFollowerList
          user={user}
          myFollowers={myFollowers}
          setShowsFollowModal={setShowsFollowModal}
        />
      </article>
      {showsFollowModal && (
        <SearchFollowerModel
          setShowsFollowModal={setShowsFollowModal}
          followers={followers}
          profileUserId={user.userId}
        />
      )}
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
  try {
    const getUserData = await request(
      'http://localhost:3000/api/graphql',
      GET_USER_BY_Id,
      { id: params.id }
    );
    const userId = getUserData.getUserById?.userId;

    if (userId) {
      const allFollowersData = await request(
        'http://localhost:3000/api/graphql',
        ALL_FOLLOWERS,
        { userId }
      );
      return {
        props: {
          user: getUserData.getUserById,
          myFollowers: allFollowersData.allFollowers,
        },
      };
    }
    return {
      props: {
        user: getUserData.getUserById,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: '/',
      },
    };
  }
}
