import { useEffect, useState } from 'react';
import AccountInput from '../common/Input/AccountInput';
import vaildateForm from '@/utils/validateForm';
import AccountSubmit from '../common/Input/AccountSubmit';
import { inputClickEvent } from '@/types/HTMLEvents';
import { CHECK_USER } from '@/utils/graphQL/mutations/usersMutations';
import { useMutation } from '@apollo/client';
import { setAlertMessageReducer, useAppDispatch } from '@/lib/store/store';
import { setCookie } from 'cookies-next';

const USER_NOT_FOUND = 'User not found';
const PASSWORD_NOT_MATCH = 'Password not match';
const DEFAULT_ERROR_MSG = {
  userId: '',
  password: '',
};

export default function LoginForm() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);
  const [errorMsg, setErrorMsg] = useState(DEFAULT_ERROR_MSG);
  const [login] = useMutation(CHECK_USER, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

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

  const handleLogin = async (e: inputClickEvent) => {
    e.preventDefault();
    console.log(userId, password);
    const { errors: loginErrors } = await login({
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
    if (
      loginErrors &&
      loginErrors[0].message === '이미 로그인 된 사용자입니다.'
    )
      return dispatch(setAlertMessageReducer('이미 로그인 된 사용자입니다.'));
    setCookie('uid', userId);
    window.location.href;
  };

  return (
    <form className="flex flex-col">
      <AccountInput
        name="userId"
        value={userId}
        onChange={setUserId}
        errorMsg={errorMsg.userId}
      />
      <AccountInput
        name="password"
        value={password}
        onChange={setPassword}
        errorMsg={errorMsg.password}
      />
      <AccountSubmit
        value="로그인"
        onClick={handleLogin}
        isDisabledSubmit={isDisabledSubmit}
      />
    </form>
  );
}
