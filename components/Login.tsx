import { AuthModelFunction } from '@/pages';
import vaildateForm from '@/utils/validateForm';
import React, { useEffect, useState } from 'react';

export default function Login({
  showLogin,
  showJoin,
  closeAuth,
}: AuthModelFunction) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);

  useEffect(() => {
    const validateResponse = vaildateForm({ userId, password });
    if (!validateResponse.route) return setIsDisabledSubmit(false);
    return setIsDisabledSubmit(true);
  }, [userId, password]);

  const handleLogin = (e: React.MouseEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log('login');
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
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
        />
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
