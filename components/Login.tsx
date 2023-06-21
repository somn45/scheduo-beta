import { graphql } from '@/generates/type';
import { AuthModelFunction } from '@/pages';
import vaildateForm from '@/utils/validateForm';
import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';

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
    if (!validateResponse.route) return setIsDisabledSubmit(false);
    return setIsDisabledSubmit(true);
  }, [userId, password]);

  const handleLogin = async (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { data, errors: loginErrors } = await login({
      variables: { userId, password },
    });
    if (loginErrors && loginErrors[0].message === USER_NOT_FOUND)
      setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        userId: '가입된 계정이 존재하지 않습니다.',
      });
    if (loginErrors && loginErrors[0].message === PASSWORD_NOT_MATCH)
      setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        password: '비밀번호가 일치하지 않습니다.',
      });
  };

  return (
    <>
      <form>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="아이디"
        />
        <span>{errorMsg.userId}</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
        <span>{errorMsg.password}</span>
        <input
          type="submit"
          value="로그인"
          onClick={handleLogin}
          disabled={isDisabledSubmit}
        />
      </form>
      <button onClick={showJoin}>Scheduo 회원가입하기</button>
    </>
  );
}
