import { useEffect, useState } from 'react';
import AccountInput from '../common/Input/AccountInput';
import AccountSubmit from '../common/Input/AccountSubmit';
import { inputClickEvent } from '@/types/HTMLEvents';
import { CHECK_USER } from '@/utils/graphQL/mutations/usersMutations';
import { useMutation } from '@apollo/client';
import { setAlertMessageReducer, useAppDispatch } from '@/lib/store/store';
import { setCookie } from 'cookies-next';
import useInputValidate, { Form } from '@/hooks/useInputValidate';
import { INITIAL_LOGIN_FORM, VALIDATION_FORM } from './constants/constants';
import { useRouter } from 'next/router';

const USER_NOT_FOUND = 'User not found';
const PASSWORD_NOT_MATCH = 'Password not match';

export default function LoginForm() {
  const [input, setInput, validateErrorMessage] = useInputValidate(
    INITIAL_LOGIN_FORM,
    VALIDATION_FORM
  );
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(true);
  const [login] = useMutation(CHECK_USER, {
    errorPolicy: 'all',
  });
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (validateErrorMessage.userId || validateErrorMessage.password)
      return setIsDisabledSubmit(true);
    return setIsDisabledSubmit(false);
  }, [input, validateErrorMessage]);

  const handleLogin = async (e: inputClickEvent) => {
    e.preventDefault();
    const { errors: loginErrors } = await login({
      variables: { userId: input.userId, password: input.password },
    });
    if (loginErrors) {
      if (loginErrors[0].message === USER_NOT_FOUND) {
        return dispatch(
          setAlertMessageReducer('가입된 계정이 존재하지 않습니다.')
        );
      }
      if (loginErrors[0].message === PASSWORD_NOT_MATCH) {
        return dispatch(
          setAlertMessageReducer(
            '계정의 아이디와 비밀번호가 일치하지 않습니다.'
          )
        );
      }
      if (loginErrors[0].message === '이미 로그인 된 사용자입니다.') {
        return dispatch(setAlertMessageReducer('이미 로그인 된 사용자입니다.'));
      }
    }
    setCookie('uid', input.userId);
    router.push('/');
  };

  return (
    <form className="flex flex-col items-center">
      <AccountInput
        name="userId"
        value={input.userId}
        onChange={setInput}
        errorMsg={validateErrorMessage.userId}
      />
      <AccountInput
        name="password"
        value={input.password}
        onChange={setInput}
        errorMsg={validateErrorMessage.password}
      />
      <AccountSubmit
        value="로그인"
        onClick={handleLogin}
        isDisabledSubmit={isDisabledSubmit}
      />
    </form>
  );
}
