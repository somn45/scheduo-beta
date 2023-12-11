interface Form {
  fullname?: string;
  email?: string;
  company?: string;
}

type ValidateMethod = (accountForm: Form) => boolean;

interface ValidateEditResponse {
  fullname?: string;
  email?: string;
}

export const INITIAL_EDIT_ERROR_MESSAGE = {
  fullname: '',
  email: '',
  company: '',
};

const EMAIL_REGEXP = /[a-z0-9]+@[a-z]+.[a-z]{2,3}/g;

export const VALIDATION_EDIT_FORM = new Map<
  ValidateMethod,
  ValidateEditResponse
>([
  [
    (accountForm) => !accountForm.fullname,
    {
      ...INITIAL_EDIT_ERROR_MESSAGE,
      fullname: '이름은 필수 항목입니다.',
    },
  ],
  [
    (accountForm) => {
      const { fullname } = accountForm;
      if (fullname) {
        if (fullname.length <= 2 && fullname.length >= 6) return true;
        else return false;
      }
      return true;
    },
    {
      ...INITIAL_EDIT_ERROR_MESSAGE,
      fullname: '이름은 3자 이상 5자 이하로 작성해주세요.',
    },
  ],
  [
    (accountForm) => {
      const { email } = accountForm;
      if (email) {
        if (email.match(EMAIL_REGEXP)) return false;
        else return true;
      }
      return false;
    },
    {
      ...INITIAL_EDIT_ERROR_MESSAGE,
      email: '이메일 형식에 맞게 입력해 주세요.',
    },
  ],
]);
