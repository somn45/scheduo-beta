import request from 'graphql-request';
import { IFollower, IUser } from '@/types/interfaces/users.interface';
import {
  ALL_FOLLOWERS,
  GET_USERS,
  GET_USER_BY_Id,
  SEARCH_FOLLOWERS,
  SEARCH_FOLLOWERS_BY_ID,
} from '@/utils/graphQL/querys/userQuerys';
import { useSelector } from 'react-redux';
import wrapper, {
  RootState,
  addFollowerReducer,
  initFollowerReducer,
  useAppDispatch,
} from '@/lib/store/store';
import Follower from '@/components/Follower';
import { useEffect, useState } from 'react';
import FollowerPreview from '@/components/FollowerPreview';
import UserProfileItem from '@/components/layout/list/UserProfileItem';

interface UserProfileProps {
  user: IUser;
  myFollowers: IFollower[];
}

export default function User({ user, myFollowers }: UserProfileProps) {
  const [showesFollowModal, setShowesFollowModal] = useState(false);
  const followers = useSelector((state: RootState) => state.followers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initFollowerReducer(myFollowers));
  }, []);

  return (
    <section className="mt-10 flex">
      <article className="w-1/2 h-80 mb-5 px-3 border-dotted border-r-2 flex flex-col items-center">
        <div className="mb-5 flex flex-col items-center">
          <h1 className="text-xl font-semibold">{user.name}</h1>
          <span className="text-sm text-slate-400">{user._id}</span>
        </div>
        <ul className="w-1/2 flex flex-col">
          <UserProfileItem caption="아이디" value={user.userId} />
          <UserProfileItem
            caption="이메일"
            value={user.email ? user.email : '미등록'}
          />
          <UserProfileItem
            caption="소속 기업"
            value={user.company ? user.company : '미등록'}
          />
        </ul>
      </article>
      <article className="w-1/2 flex flex-col items-center">
        <div className="w-full flex justify-between">
          <p className="w-1/3"></p>
          <h3 className="w-1/3 mb-3 text-lg font-semibold text-center">
            팔로워 목록
          </h3>
          <div className="w-1/3 flex justify-center items-center">
            <button
              onClick={() => setShowesFollowModal(true)}
              className="px-2 py-1 border rounded-md hover:bg-slate-200 focus:bg-slate-200"
            >
              팔로워 추가+
            </button>
          </div>
        </div>
        <div className="w-full px-20 grid gap-4 grid-cols-4">
          <ul>
            {followers &&
              followers.map((follower) => (
                <Follower
                  key={follower.userId}
                  follower={follower}
                  profileUserId={user.userId}
                />
              ))}
          </ul>
        </div>
      </article>
      {showesFollowModal && (
        <FollowerPreview
          setShowesFollowModal={setShowesFollowModal}
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
