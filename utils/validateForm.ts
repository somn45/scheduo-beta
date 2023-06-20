interface LoginForm {
  userId: string;
  password: string;
}

interface JoinForm extends LoginForm {
  confirmPassword: string;
  email: string;
  company: string;
}

interface ValidateLoginResponse {
  route?: keyof LoginForm;
  validatePass: boolean;
}

interface ValidateJoinResponse {
  route?: keyof JoinForm;
  validatePass: boolean;
}

const EMAIL_REGEXP = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/g;

export const vaildateForm = (accountForm: LoginForm): ValidateLoginResponse => {
  if (!(accountForm.userId && accountForm.password))
    return { route: 'userId', validatePass: false };
  else if (accountForm.userId.length <= 5 || accountForm.userId.length >= 21)
    return { route: 'userId', validatePass: false };
  else if (
    accountForm.password.length <= 5 ||
    accountForm.password.length >= 25
  )
    return { route: 'password', validatePass: false };
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
    return { route: 'password', validatePass: false };
  if (!accountForm.confirmPassword)
    return { route: 'confirmPassword', validatePass: false };
  if (accountForm.email && !accountForm.email.match(EMAIL_REGEXP))
    return { route: 'email', validatePass: false };
  else return { validatePass: true };
};

export default vaildateForm;
