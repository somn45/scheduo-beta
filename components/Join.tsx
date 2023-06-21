import { graphql } from '@/generates/type';
import { AuthModelFunction } from '@/pages';
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
  comfirmPassword: '',
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
    if (!validateResponse.validatePass) return setIsDisabledSubmit(true);
    else return setIsDisabledSubmit(false);
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
    <div>
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
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="비밀번호 확인"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
        />
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="직장"
        />
        <input
          type="submit"
          value="회원가입"
          onClick={handleLogin}
          disabled={isDisabledSubmit}
        />
      </form>
      <button onClick={showLogin}>기존 계정으로 로그인</button>
    </div>
  );
}
