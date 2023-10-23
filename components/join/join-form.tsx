import { useEffect, useState } from 'react';
import AccountInput from '../common/Input/AccountInput';
import AccountLabel from '../layout/label/AccountLabel';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '@/utils/graphQL/mutations/usersMutations';
import { validateJoinForm } from '@/utils/validateForm';
import AccountSubmit from '../common/Input/AccountSubmit';
import { inputClickEvent } from '@/types/HTMLEvents';

const USER_EXISTS_ERROR_MSG = 'User already exists';
const DEFAULT_ERROR_MSG = {
  userId: '',
  password: '',
  confirmPassword: '',
  name: '',
  email: '',
};

export default function JoinForm() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
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
      name,
      email,
      company,
    });
    if (!validateResponse.validatePass) setIsDisabledSubmit(true);
    if (validateResponse.route === 'userId')
      return setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        userId: validateResponse.message ? validateResponse.message : '',
      });
    else if (validateResponse.route === 'password')
      return setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        password: validateResponse.message ? validateResponse.message : '',
      });
    else if (validateResponse.route === 'confirmPassword')
      return setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        confirmPassword: validateResponse.message
          ? validateResponse.message
          : '',
      });
    else if (validateResponse.route === 'name')
      return setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        name: validateResponse.message ? validateResponse.message : '',
      });
    else if (validateResponse.route === 'email')
      return setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        email: validateResponse.message ? validateResponse.message : '',
      });
    setErrorMsg(DEFAULT_ERROR_MSG);
    return setIsDisabledSubmit(false);
  }, [userId, password, confirmPassword, name, email]);

  const handleJoin = async (e: inputClickEvent) => {
    e.preventDefault();
    const { errors } = await join({
      variables: { userId, password, name, email, company },
    });
    if (errors && errors[0].message === USER_EXISTS_ERROR_MSG)
      setErrorMsg({
        ...DEFAULT_ERROR_MSG,
        userId: '이미 가입된 계정이 존재합니다',
      });
    else if (errors) {
      alert(errors[0].message);
    }
  };

  return (
    <>
      <span>*는 필수 문항입니다</span>
      <form className="flex flex-col">
        <AccountLabel caption="*아이디(6자 이상 ~ 24자 이하)" />
        <AccountInput
          name="userId"
          value={userId}
          onChange={setUserId}
          errorMsg={errorMsg.userId}
        />

        <AccountLabel caption=" *비밀번호(6자 이상 ~ 24자 이하)" />
        <AccountInput
          name="password"
          value={password}
          onChange={setPassword}
          errorMsg={errorMsg.password}
        />

        <AccountLabel caption=" *비밀번호 확인" />
        <AccountInput
          name="confirmPassword"
          value={confirmPassword}
          onChange={setConfirmPassword}
          errorMsg={errorMsg.confirmPassword}
        />

        <AccountLabel caption=" *이름" />
        <AccountInput
          name="name"
          value={name}
          onChange={setName}
          errorMsg={errorMsg.name}
        />

        <AccountLabel caption=" *이메일" />
        <AccountInput
          name="email"
          value={email}
          onChange={setEmail}
          errorMsg={errorMsg.email}
        />

        <AccountLabel caption="직장" />
        <AccountInput
          name="company"
          value={company}
          onChange={setCompany}
          errorMsg={''}
        />

        <AccountSubmit
          value="회원가입"
          onClick={handleJoin}
          isDisabledSubmit={isDisabledSubmit}
        />
      </form>
    </>
  );
}
