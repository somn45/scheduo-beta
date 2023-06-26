import { graphql } from '@/generates/type';
import { AuthModelFunction } from '../layout/Header';
import vaildateForm from '@/utils/validateForm';
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { setCookie } from 'cookies-next';

const CHECK_USER = graphql(`
  mutation Login($userId: String!, $password: String!) {
    checkUser(userId: $userId, password: $password) {
      userId
    }
  }
`);

const USER_NOT_FOUND = 'User not found';
const PASSWORD_NOT_MATCH = 'Password not match';
const DEFAULT_ERROR_MSG = {
  userId: '',
  password: '',
};

export default function Login({
  showLogin,
  showJoin,
  closeAuth,
}: AuthModelFunction) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState(DEFAULT_ERROR_MSG);
  const [login] = useMutation(CHECK_USER, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    const validateResponse = vaildateForm({ userId, password });
    if (validateResponse.validatePass) {
      setErrorMsg(DEFAULT_ERROR_MSG);
      return setIsDisabledSubmit(false);
    }
    if (validateResponse.route === 'userId')
      setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        userId: validateResponse.message ? validateResponse.message : '',
      });
    else if (validateResponse.route === 'password')
      setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        password: validateResponse.message ? validateResponse.message : '',
      });
    return setIsDisabledSubmit(true);
  }, [userId, password]);

  const handleLogin = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { data, errors: loginErrors } = await login({
      variables: { userId, password },
    });
    if (loginErrors && loginErrors[0].message === USER_NOT_FOUND)
      return setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        userId: '가입된 계정이 존재하지 않습니다.',
      });
    if (loginErrors && loginErrors[0].message === PASSWORD_NOT_MATCH)
      return setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        password: '비밀번호가 일치하지 않습니다.',
      });
    setCookie('uid', userId);
    window.location.reload();
  };

  return (
    <section className="w-full h-screen fixed bg-black/60 flex justify-center items-center">
      <div className="w-1/5 px-8 py-5 rounded-[5px] text-sm bg-slate-50">
        <div className="mb-5 flex justify-end">
          <button
            onClick={closeAuth}
            className="text-xl text-right font-semibold"
          >
            X
          </button>
        </div>
        <h2 className="mb-8 text-center text-3xl font-semibold">Scheduo</h2>
        <form className="flex flex-col">
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디"
            className={`h-8 mb-1 p-2 border-b-2 outline-none rounded-[3px] text-sm focus:outline-black ${
              errorMsg.userId && 'border-red-300'
            }`}
          />
          <span className="ml-2 mb-5 text-red-600">{errorMsg.userId}</span>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className={`h-8 mb-1 p-2 border-b-2 outline-none rounded-[3px] text-sm focus:outline-black ${
              errorMsg.password && 'border-red-300'
            }`}
          />
          <span className="ml-2 mb-5 text-red-600">{errorMsg.password}</span>

          <input
            type="submit"
            value="로그인"
            onClick={handleLogin}
            disabled={isDisabledSubmit}
            className={`h-8 mb-3 p-1 bg-blue-400 border-none outline-none rounded-[3px] text-white font-semibold ease-out duration-200 ${
              isDisabledSubmit
                ? 'opacity-20'
                : 'opacity-100 cursor-pointer hover:bg-blue-600'
            }`}
          />
        </form>
        <button
          onClick={showJoin}
          className="text-center font-semibold ease-out duration-100 hover:text-pink-400"
        >
          Scheduo 회원가입하기
        </button>
      </div>
    </section>
  );
}
