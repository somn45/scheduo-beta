interface LoginForm {
  userId: string;
  password: string;
}

interface JoinForm extends LoginForm {
  confirmPassword: string;
  name: string;
  email: string;
  company: string;
}

interface ValidateLoginResponse {
  route?: keyof LoginForm;
  validatePass: boolean;
  message?: string;
}

interface ValidateJoinResponse {
  route?: keyof JoinForm;
  validatePass: boolean;
  message?: string;
}

const EMAIL_REGEXP = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/g;

export const vaildateForm = (accountForm: LoginForm): ValidateLoginResponse => {
  if (!accountForm.userId)
    return {
      route: 'userId',
      validatePass: false,
      message: '아이디는 필수 항목입니다.',
    };
  else if (accountForm.userId.length <= 5 || accountForm.userId.length >= 21)
    return {
      route: 'userId',
      validatePass: false,
      message: '아이디는 6자 이상 20자 이하로 작성해주세요.',
    };
  if (!accountForm.password)
    return {
      route: 'password',
      validatePass: false,
      message: '비밀번호는 필수 항목입니다.',
    };
  else if (
    accountForm.password.length <= 5 ||
    accountForm.password.length >= 25
  )
    return {
      route: 'password',
      validatePass: false,
      message: '비밀번호는 6자 이상 24자 이하로 작성해주세요.',
    };
  else return { validatePass: true };
};

export const validateJoinForm = (
  accountForm: JoinForm
): ValidateJoinResponse => {
  const userIdAndPwdValidateRes = vaildateForm({
    userId: accountForm.userId,
    password: accountForm.password,
  });
  if (!userIdAndPwdValidateRes.validatePass) return userIdAndPwdValidateRes;
  if (accountForm.password !== accountForm.confirmPassword)
    return {
      route: 'password',
      validatePass: false,
      message: '비밀번호 항목과 비밀번호 확인 항목이 일치하지 않습니다.',
    };
  if (!accountForm.confirmPassword)
    return {
      route: 'confirmPassword',
      validatePass: false,
      message: '비밀번호 확인은 필수 항목입니다.',
    };
  if (!accountForm.name)
    return {
      route: 'name',
      validatePass: false,
      message: '이름은 필수 항목입니다.',
    };
  if (accountForm.name.length <= 2 || accountForm.name.length >= 6)
    return {
      route: 'name',
      validatePass: false,
      message: '이름은 3자 이상 5자 이하로 작성해주세요.',
    };
  if (accountForm.email && !accountForm.email.match(EMAIL_REGEXP))
    return {
      route: 'email',
      validatePass: false,
      message: '이메일 형식에 맞게 입력해 주세요.',
    };
  else return { validatePass: true };
};

export default vaildateForm;
