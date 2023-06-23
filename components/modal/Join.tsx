import { graphql } from '@/generates/type';
import { AuthModelFunction } from '../layout/Header';
import { validateJoinForm } from '@/utils/validateForm';
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';

const ADD_USER = graphql(`
  mutation join(
    $userId: String!
    $password: String!
    $email: String
    $company: String
  ) {
    addUser(
      userId: $userId
      password: $password
      email: $email
      company: $company
    ) {
      userId
      email
      company
    }
  }
`);

const USER_EXISTS_ERROR_MSG = 'User already exists';
const DEFAULT_ERROR_MSG = {
  userId: '',
  password: '',
  confirmPassword: '',
  email: '',
};

export default function Join({ showLogin, closeAuth }: AuthModelFunction) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState(DEFAULT_ERROR_MSG);
  const [join] = useMutation(ADD_USER, {
    errorPolicy: 'all',
  });

  useEffect(() => {
    const validateResponse = validateJoinForm({
      userId,
      password,
      confirmPassword,
      email,
      company,
    });
    if (validateResponse.validatePass) return setIsDisabledSubmit(true);
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
    else if (validateResponse.route === 'confirmPassword')
      setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        confirmPassword: validateResponse.message
          ? validateResponse.message
          : '',
      });
    else if (validateResponse.route === 'email')
      setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        email: validateResponse.message ? validateResponse.message : '',
      });
    return setIsDisabledSubmit(false);
  }, [userId, password, confirmPassword, email]);

  const handleLogin = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { data, errors } = await join({
      variables: { userId, password, email, company },
    });
    if (errors && errors[0].message === USER_EXISTS_ERROR_MSG)
      setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        userId: '이미 가입된 계정이 존재합니다',
      });
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
        <span>*는 필수 문항입니다</span>
        <form className="flex flex-col">
          <label className="ml-2 mb-1 text-xs font-semibold">
            *아이디(6자 이상 ~ 20자 이하)
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="아이디"
            className={`h-8 mb-1 p-2 border-b-2 outline-none rounded-[3px] text-sm focus:outline-black ${
              errorMsg.userId && 'border-red-300'
            }`}
          />
          <span className="ml-2 mb-5 text-red-500">{errorMsg.userId}</span>

          <label className="ml-2 mb-1 text-xs font-semibold">
            *비밀번호(6자 이상 ~ 24자 이하)
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className={`h-8 mb-1 p-2 border-b-2 outline-none rounded-[3px] text-sm focus:outline-black ${
              errorMsg.password && 'border-red-300'
            }`}
          />
          <span className="ml-2 mb-5 text-red-500">{errorMsg.password}</span>

          <label className="ml-2 mb-1 text-xs font-semibold">
            *비밀번호 확인
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호 확인"
            className={`h-8 mb-1 p-2 border-b-2 outline-none rounded-[3px] text-sm focus:outline-black ${
              errorMsg.confirmPassword && 'border-red-300'
            }`}
          />
          <span className="ml-2 mb-5 text-red-500">
            {errorMsg.confirmPassword}
          </span>

          <label className="ml-2 mb-1 text-xs font-semibold">이메일</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
            className={`h-8 mb-1 p-2 border-b-2 outline-none rounded-[3px] text-sm focus:outline-black ${
              errorMsg.email && 'border-red-300'
            }`}
          />
          <span className="ml-2 mb-5 text-red-500">{errorMsg.email}</span>

          <label className="ml-2 mb-1 text-xs font-semibold">직장</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="직장"
            className="h-8 mb-5 p-2 outline-none rounded-[3px] text-sm focus:outline-black"
          />
          <input
            type="submit"
            value="회원가입"
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
          onClick={showLogin}
          className="text-center font-semibold ease-out duration-100 hover:text-pink-400"
        >
          기존 계정으로 로그인
        </button>
      </div>
    </section>
  );
}
