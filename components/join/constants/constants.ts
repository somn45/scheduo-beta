export interface Form {
  userId: string;
  password?: string;
  confirmPassword?: string;
  fullname?: string;
  email?: string;
}

type ValidateMethod = (accountForm: Form) => boolean;

interface ValidateLoginResponse {
  userId: string;
  password?: string;
  confirmPassword?: string;
  fullname?: string;
  email?: string;
}

export const INITIAL_JOIN_FORM = {
  userId: '',
  password: '',
  confirmPassword: '',
  name: '',
  email: '',
  company: '',
};

const EMAIL_REGEXP = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/g;

export const VALIDATION_JOIN_FORM = new Map<
  ValidateMethod,
  ValidateLoginResponse
>([
  [
    (accountForm) => !accountForm.userId,
    {
      ...INITIAL_JOIN_FORM,
      userId: '아이디는 필수 항목입니다.',
    },
  ],
  [
    (accountForm) =>
      accountForm.userId.length <= 5 || accountForm.userId.length >= 21,
    {
      ...INITIAL_JOIN_FORM,
      userId: '아이디는 6자 이상 20자 이하로 작성해주세요.',
    },
  ],
  [
    (accountForm) => !accountForm.password,
    {
      ...INITIAL_JOIN_FORM,
      password: '비밀번호는 필수 항목입니다.',
    },
  ],
  [
    (accountForm) => {
      const { password } = accountForm;
      if (password && password.length <= 5 && password.length >= 25) {
        return true;
      }
      return false;
    },
    {
      ...INITIAL_JOIN_FORM,
      password: '비밀번호는 6자 이상 24자 이하로 작성해주세요.',
    },
  ],
  [
    (accountForm) => !accountForm.confirmPassword,
    {
      ...INITIAL_JOIN_FORM,
      confirmPassword: '비밀번호 확인은 필수 항목입니다.',
    },
  ],
  [
    (accountForm) => accountForm.password !== accountForm.confirmPassword,
    {
      ...INITIAL_JOIN_FORM,
      password: '비밀번호 항목과 비밀번호 확인 항목이 일치하지 않습니다.',
    },
  ],
  [
    (accountForm) => !accountForm.fullname,
    {
      ...INITIAL_JOIN_FORM,
      fullname: '이름은 필수 항목입니다.',
    },
  ],
  [
    (accountForm) => {
      const { fullname } = accountForm;
      if (fullname) {
        if (fullname.length <= 2 && fullname.length >= 6) return false;
        else return true;
      }
      return false;
    },
    {
      ...INITIAL_JOIN_FORM,
      fullname: '이름은 3자 이상 5자 이하로 작성해주세요.',
    },
  ],
  [
    (accountForm) => {
      const { email } = accountForm;
      if (email) {
        if (email.match(EMAIL_REGEXP)) return true;
        else return false;
      }
      return true;
    },
    {
      ...INITIAL_JOIN_FORM,
      email: '이메일 형식에 맞게 입력해 주세요.',
    },
  ],
]);
