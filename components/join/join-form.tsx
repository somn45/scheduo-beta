import { useEffect, useState } from 'react';
import AccountInput from '../common/Input/AccountInput';
import AccountLabel from '../common/label/AccountLabel';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '@/utils/graphQL/mutations/usersMutations';
import AccountSubmit from '../common/Input/AccountSubmit';
import { inputClickEvent } from '@/types/HTMLEvents';
import useInputValidate from '@/hooks/useInputValidate';
import { INITIAL_JOIN_FORM, VALIDATION_JOIN_FORM } from './constants/constants';
import { setAlertMessageReducer, useAppDispatch } from '@/lib/store/store';

const USER_EXISTS_ERROR_MSG = 'User already exists';

export default function JoinForm() {
  const [input, setInput, validateErrorMessage] = useInputValidate(
    INITIAL_JOIN_FORM,
    VALIDATION_JOIN_FORM
  );
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);
  const [join] = useMutation(ADD_USER, {
    errorPolicy: 'all',
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      validateErrorMessage.userId ||
      validateErrorMessage.password ||
      validateErrorMessage.confirmPassword ||
      validateErrorMessage.email
    )
      return setIsDisabledSubmit(true);
    return setIsDisabledSubmit(false);
  }, [input, validateErrorMessage]);

  const handleJoin = async (e: inputClickEvent) => {
    e.preventDefault();
    const { userId, password, fullname, email, company } = input;
    const { errors: joinErrors } = await join({
      variables: {
        userId,
        password,
        name: fullname ? fullname : '',
        email: email ? email : '',
        company: company ? company : '',
      },
    });
    if (joinErrors) {
      if (joinErrors[0].message === USER_EXISTS_ERROR_MSG)
        dispatch(setAlertMessageReducer('이미 가입된 계정이 존재합니다.'));
      else {
        alert(joinErrors[0].message);
      }
    }
  };

  return (
    <form className="w-full flex flex-col items-center">
      <AccountLabel caption="*아이디(6자 이상 ~ 24자 이하)" />
      <AccountInput
        name="userId"
        value={input.userId}
        onChange={setInput}
        errorMsg={validateErrorMessage.userId}
      />

      <AccountLabel caption=" *비밀번호(6자 이상 ~ 24자 이하)" />
      <AccountInput
        name="password"
        value={input.password}
        onChange={setInput}
        errorMsg={validateErrorMessage.password}
      />

      <AccountLabel caption=" *비밀번호 확인" />
      <AccountInput
        name="confirmPassword"
        value={input.confirmPassword ? input.confirmPassword : ''}
        onChange={setInput}
        errorMsg={
          validateErrorMessage.confirmPassword
            ? validateErrorMessage.confirmPassword
            : ''
        }
      />

      <AccountLabel caption=" *이름" />
      <AccountInput
        name="fullname"
        value={input.fullname ? input.fullname : ''}
        onChange={setInput}
        errorMsg={
          validateErrorMessage.fullname ? validateErrorMessage.fullname : ''
        }
      />

      <AccountLabel caption=" *이메일" />
      <AccountInput
        name="email"
        value={input.email ? input.email : ''}
        onChange={setInput}
        errorMsg={validateErrorMessage.email ? validateErrorMessage.email : ''}
      />

      <AccountLabel caption="직장" />
      <AccountInput
        name="company"
        value={input.company ? input.company : ''}
        onChange={setInput}
        errorMsg={''}
      />

      <AccountSubmit
        value="회원가입"
        onClick={handleJoin}
        isDisabledSubmit={isDisabledSubmit}
      />
    </form>
  );
}
