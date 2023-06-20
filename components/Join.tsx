import { AuthModelFunction } from '@/pages';
import { validateJoinForm } from '@/utils/validateForm';
import React, { useEffect, useState } from 'react';

export default function Join({ showLogin, closeAuth }: AuthModelFunction) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);

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
  }, []);

  const handleLogin = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('join');
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
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
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
