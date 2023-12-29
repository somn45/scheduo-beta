import AccountInput from '@/components/common/Input/AccountInput';
import AccountSubmit from '@/components/common/Input/AccountSubmit';
import AccountLinkButton from '@/components/common/button/AccountLinkButton';
import AccountLabel from '@/components/common/label/AccountLabel';
import { VALIDATION_EDIT_FORM } from '@/components/users/([id])/edit/constants/constants';
import useEditFormValidate from '@/hooks/useEditFormValidate';
import { useAppDispatch } from '@/lib/store/store';
import { inputClickEvent } from '@/types/HTMLEvents';
import { IUser } from '@/types/interfaces/users.interface';
import { EDIT_USER } from '@/utils/graphQL/mutations/usersMutations';
import { GET_USERS, GET_USER_BY_Id } from '@/utils/graphQL/querys/userQuerys';
import { useMutation } from '@apollo/client';
import request from 'graphql-request';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function EditProfile({ user }: { user: IUser }) {
  const [input, setInput, validateErrorMessage] = useEditFormValidate(
    {
      fullname: user.name ? user.name : '',
      email: user.email ? user.email : '',
      company: user.company ? user.company : '',
    },
    VALIDATION_EDIT_FORM
  );
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);
  const [editUser] = useMutation(EDIT_USER);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      validateErrorMessage.fullname ||
      validateErrorMessage.email ||
      validateErrorMessage.company
    ) {
      return setIsDisabledSubmit(true);
    }
    return setIsDisabledSubmit(false);
  }, [input, validateErrorMessage]);

  const handleEdit = async (e: inputClickEvent) => {
    e.preventDefault();
    const { data, errors } = await editUser({
      variables: {
        _id: user._id ? user._id : '',
        name: input.fullname ? input.fullname : '',
        email: input.email ? input.email : '',
        company: input.company ? input.company : '',
      },
    });
    router.push(`/users/${user._id}`);
  };

  return (
    <section className="w-full h-full flex flex-col items-center">
      <article
        className="w-full lg:w-1/2 2xl:w-1/3 px-8 py-5 text-sm 
          flex flex-col items-center"
      >
        <h2 className="mb-5 text-lg font-semibold">프로필 수정 화면</h2>
        <form className="w-full flex flex-col items-center">
          <AccountLabel caption="이름" />
          <AccountInput
            name="fullname"
            value={input.fullname ? input.fullname : ''}
            onChange={setInput}
            errorMsg={
              validateErrorMessage.fullname ? validateErrorMessage.fullname : ''
            }
          />

          <AccountLabel caption="이메일" />
          <AccountInput
            name="email"
            value={input.email ? input.email : ''}
            onChange={setInput}
            errorMsg={
              validateErrorMessage.email ? validateErrorMessage.email : ''
            }
          />

          <AccountLabel caption="직장" />
          <AccountInput
            name="company"
            value={input.company ? input.company : ''}
            onChange={setInput}
            errorMsg={
              validateErrorMessage.company ? validateErrorMessage.company : ''
            }
          />

          <AccountSubmit
            value="프로필 변경"
            onClick={handleEdit}
            isDisabledSubmit={isDisabledSubmit}
          />
        </form>
        <AccountLinkButton
          value="비밀번호 변경"
          onClick={() => router.push(`/users/${user._id}/edit/password/first`)}
        />
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
  try {
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
  } catch (error) {
    console.log(error);
    return {
      redirect: {
        destination: '/',
      },
    };
  }
}
