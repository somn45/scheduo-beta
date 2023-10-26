export interface Form {
  userId: string;
  password: string;
  confirmPassword?: string;
  fullname?: string;
  email?: string;
}

type ValidateMethod = (accountForm: Form) => boolean;

interface ValidateLoginResponse {
  userId: string;
  password: string;
}

export const INITIAL_LOGIN_FORM = {
  userId: '',
  password: '',
};

export const VALIDATION_FORM = new Map<ValidateMethod, ValidateLoginResponse>([
  [
    (accountForm) => !accountForm.userId,
    {
      ...INITIAL_LOGIN_FORM,
      userId: '아이디는 필수 항목입니다.',
    },
  ],
  [
    (accountForm) =>
      accountForm.userId.length <= 5 || accountForm.userId.length >= 21,
    {
      ...INITIAL_LOGIN_FORM,
      userId: '아이디는 6자 이상 20자 이하로 작성해주세요.',
    },
  ],
  [
    (accountForm) => !accountForm.password,
    {
      ...INITIAL_LOGIN_FORM,
      password: '비밀번호는 필수 항목입니다.',
    },
  ],
  [
    (accountForm) =>
      accountForm.password.length <= 5 || accountForm.password.length >= 25,
    {
      ...INITIAL_LOGIN_FORM,
      password: '비밀번호는 6자 이상 24자 이하로 작성해주세요.',
    },
  ],
]);
