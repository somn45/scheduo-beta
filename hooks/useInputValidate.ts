import { ChangeEvent, useEffect, useState } from 'react';

export interface Form {
  userId: string;
  password: string;
  confirmPassword?: string;
  fullname?: string;
  email?: string;
  company?: string;
}

type ValidateMethod = (accountForm: Form) => boolean;

interface ValidateLoginResponse {
  userId: string;
  password: string;
  confirmPassword?: string;
  fullname?: string;
  email?: string;
}

type ValidationMap = Map<ValidateMethod, ValidateLoginResponse>;

type useInputValidateType = (
  form: Form,
  validationMap: ValidationMap
) => [Form, (e: ChangeEvent<HTMLInputElement>) => void, Form];

const DEFAULT_ERROR_MSG: Form = {
  userId: '',
  password: '',
};

const useInputValidate: useInputValidateType = (form, validationMap) => {
  const [input, setInput] = useState(form);
  const [errorMessage, setErrorMessage] = useState<Form>(DEFAULT_ERROR_MSG);

  useEffect(() => {
    for (let [validateMethods, errorMessageValue] of validationMap) {
      if (validateMethods(input)) return setErrorMessage(errorMessageValue);
    }
    setErrorMessage(DEFAULT_ERROR_MSG);
  }, [input]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const {
      target: { name, value },
    } = e;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  return [input, onChange, errorMessage];
};

export default useInputValidate;
